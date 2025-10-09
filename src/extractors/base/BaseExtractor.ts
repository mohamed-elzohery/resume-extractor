import type { ZodSchema } from 'zod/v3';
import { extractWithLLM } from '../../services/llm';

/**
 * Base class for all extractors.
 */
export abstract class BaseExtractor {
    constructor() { }

    /**
     * Get the zod schema for the extractor.
     */
    abstract getSchema(): ZodSchema;

    /**
     * Get the prompt template for the extractor.
     */
    abstract getPromptTemplate(): string;

    /**
     * Get the output format - either "array" or "object".
     */
    abstract getOutputFormat(): "array" | "object";

    /**
     * Prepare input data for extraction (can be overridden by subclasses).
     */
    protected prepareInputData(extractedText: string): string {
        return extractedText;
    }

    /**
     * Process the output from LLM (can be overridden by subclasses).
     */
    protected processOutput(output: any): any {
        return output;
    }

    /**
     * Extract information from the resume.
     */
    async extract(extractedText: string): Promise<any> {
        const inputData = this.prepareInputData(extractedText);
        const output = await extractWithLLM(
            this.getSchema(),
            this.getPromptTemplate(),
            this.getOutputFormat()
        );
        return this.processOutput(output);
    }
}