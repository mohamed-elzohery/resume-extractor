import { z } from 'zod';
import { ExtractorFactory } from '../extractors/ExtractorFactory';
import type {
    ExtractionMode,
    ExtractionRequest,
    ExtractionResult,
    ExtractorSelection,
    PreparedExtractor,
    SingleExtractorRequest,
    SelectionOutput,
} from '../types/extractor.types';
import type { ExtractorExecutionOptions } from '../extractors/base/BaseExtractor';
import { extractWithLLM } from '../services/llm';
import type { ZodSchema } from 'zod/v3';

const DEFAULT_SYSTEM_PROMPT = 'You are an accurate resume extractor assistant.';

interface ExtractionStrategy {
    execute<Selections extends readonly ExtractorSelection[]>(
        extractors: PreparedExtractor<Selections[number]>[],
        files: ExtractionRequest<Selections>['files'],
        systemPrompt: string
    ): Promise<ExtractionResult<Selections>>;
}

const buildBatchPrompt = (extractors: PreparedExtractor[]): string => {
    const sections = extractors
        .map((entry, index) => {
            const basePrompt = entry.overrides.prompt ?? entry.instance.getPromptTemplate();
            return `### Section ${index + 1}: ${entry.id}\n${basePrompt.trim()}`;
        })
        .join('\n\n');

    const keys = extractors.map((entry) => `- ${entry.id}`).join('\n');
    return `Extract the following resume sections with high fidelity.\n\n${sections}\n\nReturn a JSON object containing the following keys:\n${keys}`;
};

class ParallelExtractionStrategy implements ExtractionStrategy {
    async execute<Selections extends readonly ExtractorSelection[]>(
        extractors: PreparedExtractor<Selections[number]>[],
        files: ExtractionRequest<Selections>['files'],
        systemPrompt: string
    ): Promise<ExtractionResult<Selections>> {
        const result = {} as ExtractionResult<Selections>;

        await Promise.all(
            extractors.map(async (entry) => {
                const extraction = await entry.instance.extract(files, {
                    ...entry.overrides,
                    systemPrompt,
                } satisfies ExtractorExecutionOptions);
                (result as Record<string, unknown>)[entry.id] = extraction;
            })
        );

        return result;
    }
}

class BatchExtractionStrategy implements ExtractionStrategy {
    async execute<Selections extends readonly ExtractorSelection[]>(
        extractors: PreparedExtractor<Selections[number]>[],
        files: ExtractionRequest<Selections>['files'],
        systemPrompt: string
    ): Promise<ExtractionResult<Selections>> {
        const schemaShape = extractors.reduce((shape, entry) => {
            shape[entry.id] = (entry.overrides.schema ?? entry.instance.getSchema()) as any;
            return shape;
        }, {} as Record<string, any>);

        const combinedSchema = z.object(schemaShape) as unknown as ZodSchema;
        const combinedPrompt = buildBatchPrompt(extractors);

        const raw = await extractWithLLM({
            schema: combinedSchema,
            prompt: combinedPrompt,
            files,
            systemPrompt,
        });

        const result = {} as ExtractionResult<Selections>;

        return result;
    }
}

class ExtractionStrategyFactory {
    static create(mode: ExtractionMode): ExtractionStrategy {
        switch (mode) {
            case 'batch_calls':
                return new BatchExtractionStrategy();
            case 'parallel_calls':
            default:
                return new ParallelExtractionStrategy();
        }
    }
}

export class ResumeExtractionClient<Mode extends ExtractionMode = 'parallel_calls'> {
    constructor(private readonly mode: Mode = 'parallel_calls' as Mode) { }

    private getSystemPrompt(provided?: string) {
        return provided ?? DEFAULT_SYSTEM_PROMPT;
    }

    private getStrategy(): ExtractionStrategy {
        return ExtractionStrategyFactory.create(this.mode);
    }

    async extract<Selections extends readonly ExtractorSelection[]>(
        request: ExtractionRequest<Selections>
    ): Promise<ExtractionResult<Selections>> {
        const { files, extractors, context } = request;

        if (!extractors.length) {
            return {} as ExtractionResult<Selections>;
        }

        const preparedExtractors = extractors.map((selection) =>
            ExtractorFactory.prepare(selection)
        ) as PreparedExtractor<Selections[number]>[];

        const systemPrompt = this.getSystemPrompt(context?.systemPrompt);
        return this.getStrategy().execute(preparedExtractors, files, systemPrompt);
    }

    async extractOne<Selection extends ExtractorSelection>(
        request: SingleExtractorRequest<Selection>
    ): Promise<SelectionOutput<Selection>> {
        const { files, extractor, prompt, schema, outputFormat, context } = request;

        const prepared = ExtractorFactory.prepare({ extractor, prompt, schema, outputFormat });

        const result = await prepared.instance.extract(files, {
            ...prepared.overrides,
            systemPrompt: this.getSystemPrompt(context?.systemPrompt),
        } satisfies ExtractorExecutionOptions);
        return prepared.instance as SelectionOutput<Selection>;
    }
}
