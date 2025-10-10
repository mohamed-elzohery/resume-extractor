import type { ZodSchema } from 'zod/v3';
import { extractWithLLM } from '../../services/llm';
import type { ResumeFile } from '../../types/extractor.types';

type SchemaOutput<T extends ZodSchema> = T['_output'];

export interface ExtractorExecutionOptions<Schema extends ZodSchema | undefined = undefined> {
    schema?: Schema;
    prompt?: string;
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
     * Extract information from the resume.
     */
    async extract<SchemaOverride extends ZodSchema | undefined = undefined>(
        files: ResumeFile[],
        options: ExtractorExecutionOptions<SchemaOverride> = {}
    ): Promise<SchemaOverride extends ZodSchema ? SchemaOutput<SchemaOverride> : SchemaOutput<TSchema>> {
        const schema = (options.schema as ZodSchema | undefined) ?? this.getSchema();
        const prompt = options.prompt ?? this.getPromptTemplate();

        const output = await extractWithLLM({
            schema,
            prompt,
            files,
            systemPrompt: options.systemPrompt,
        });

        return output as SchemaOverride extends ZodSchema ? SchemaOutput<SchemaOverride> : SchemaOutput<TSchema>;
    }
}