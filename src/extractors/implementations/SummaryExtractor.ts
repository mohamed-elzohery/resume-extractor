import { z } from 'zod';
import { Extractor } from '../Extractor';
import { SummarySchema } from '../../schemas/sections/SummarySchema';
import { SummaryExtractionPromptTemplate } from '../../prompts/templates/summary.prompts';

/**
 * Summary extractor implementation for extracting professional summary, objective, or profile sections.
 */
const defaultSchema = z.object({ summary: SummarySchema });

export class SummaryExtractor extends Extractor<typeof defaultSchema> {
    constructor(
        prompt: string = SummaryExtractionPromptTemplate,
        schema: typeof defaultSchema = defaultSchema
    ) {
        super(prompt, schema);
    }
}
