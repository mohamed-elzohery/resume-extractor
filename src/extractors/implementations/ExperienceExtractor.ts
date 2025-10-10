import { z } from 'zod';
import { Extractor } from '../Extractor';
import { ExperienceSchema } from '../../schemas/sections/ExperienceSchema';
import { ExperianceExtractionPromptTemplate } from '../../prompts/templates/experience.prompt';

/**
 * Experience extractor implementation for extracting work experience information.
 */
const defaultSchema = z.object({ experiences: z.array(ExperienceSchema) });

export class ExperienceExtractor extends Extractor<typeof defaultSchema> {
    constructor(
        prompt: string = ExperianceExtractionPromptTemplate,
        schema: typeof defaultSchema = defaultSchema
    ) {
        super(prompt, schema);
    }
}
