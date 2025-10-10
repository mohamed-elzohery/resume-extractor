import { z } from 'zod';
import { extractWithLLM } from '../services/llm';
import type {
    AnyZodObject,
    ExtractorConfig,
    ExtractorRunOptions,
    HasPrompt,
    HasSchema,
    Runnable,
} from '../types/core.types';

export class Extractor<TSchema extends AnyZodObject = AnyZodObject>
    implements HasPrompt, HasSchema<TSchema>, Runnable<ExtractorRunOptions, TSchema['_output']> {
    protected prompt: string;
    protected schema: TSchema;

    constructor(config: ExtractorConfig<TSchema>);
    constructor(prompt: string, schema: TSchema);
    constructor(
        promptOrConfig: string | ExtractorConfig<TSchema>,
        maybeSchema?: TSchema
    ) {
        if (typeof promptOrConfig === 'string') {
            if (!maybeSchema) {
                throw new Error(
                    'Schema is required when using positional extractor constructor arguments.'
                );
            }
            this.prompt = promptOrConfig;
            this.schema = maybeSchema;
        } else {
            this.prompt = promptOrConfig.prompt;
            this.schema = promptOrConfig.schema;
        }

        this.assertObjectSchema();
    }

    getPrompt(): string {
        return this.prompt;
    }

    setPrompt(prompt: string): void {
        this.prompt = prompt;
    }

    getSchema(): TSchema {
        return this.schema;
    }

    setSchema(schema: TSchema): void {
        this.schema = schema;
        this.assertObjectSchema();
    }

    async run(options: ExtractorRunOptions): Promise<TSchema['_output']> {
        const { fileIds, systemPrompt } = options;

        if (!fileIds.length) {
            throw new Error('No file ids provided to extractor run.');
        }

        return (await extractWithLLM({
            schema: this.schema,
            prompt: this.prompt,
            fileIds,
            systemPrompt,
        })) as TSchema['_output'];
    }

    getResultKeys(): string[] {
        return Object.keys(this.schema.shape);
    }

    protected assertObjectSchema(): void {
        if (!(this.schema instanceof z.ZodObject)) {
            throw new Error('Extractor schemas must be Zod objects with named keys.');
        }
    }
}
