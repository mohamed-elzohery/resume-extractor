import type { ZodSchema } from 'zod/v3';
import { extractWithLLM } from '../../services/llm';
import type { ResumeFile } from '../../types/extractor.types';

type SchemaOutput<T extends ZodSchema> = T['_output'];

export interface ExtractorExecutionOptions<Schema extends ZodSchema | undefined = undefined> {
    schema?: Schema;
    prompt?: string;
    outputFormat?: 'array' | 'object';
    systemPrompt?: string;
}

/**
 * Base class for all extractors.
 */
export abstract class BaseExtractor<TSchema extends ZodSchema = ZodSchema> {
    constructor() { }

    /**
     * Get the zod schema for the extractor.
     */
    abstract getSchema(): TSchema;

    /**
     * Get the prompt template for the extractor.
     */
    abstract getPromptTemplate(): string;

    /**
     * Get the output format - either "array" or "object".
     */
    abstract getOutputFormat(): 'array' | 'object';

    /**
     * Process the output from LLM (can be overridden by subclasses).
     */
    protected processOutput<T>(output: T): T {
        return output;
    }

    /**
     * Public helper to post-process LLM output when used in batch orchestrations.
     */
    finalizeOutput<T = unknown>(output: T): T {
        return this.processOutput(output);
    }

    /**
     * Extract information from the resume.
     */
    async extract<SchemaOverride extends ZodSchema | undefined = undefined>(
        files: ResumeFile[],
        options: ExtractorExecutionOptions<SchemaOverride> = {}
    ): Promise<SchemaOverride extends ZodSchema ? SchemaOutput<SchemaOverride> : SchemaOutput<TSchema>> {
        const schema = (options.schema as ZodSchema | undefined) ?? this.getSchema();
        const prompt = options.prompt ?? this.getPromptTemplate();
        const outputFormat = options.outputFormat ?? this.getOutputFormat();

        const output = await extractWithLLM({
            schema,
            prompt,
            files,
            output: outputFormat,
            systemPrompt: options.systemPrompt,
        });

        return this.processOutput(output) as SchemaOverride extends ZodSchema
            ? SchemaOutput<SchemaOverride>
            : SchemaOutput<TSchema>;
    }
}