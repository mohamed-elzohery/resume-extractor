import { z } from 'zod';
import { Extractor } from '../Extractor';
import { HonorsSchema } from '../../schemas/sections/HonorsSchema';
import { HonorsExtractionPromptTemplate } from '../../prompts/templates/honors.prompt';

/**
 * Honors extractor implementation for extracting awards, honors, and recognitions.
 */
const defaultSchema = z.object({ honors: z.array(HonorsSchema) });

export class HonorsExtractor extends Extractor<typeof defaultSchema> {
    constructor(
        prompt: string = HonorsExtractionPromptTemplate,
        schema: typeof defaultSchema = defaultSchema
    ) {
        super(prompt, schema);
    }
}