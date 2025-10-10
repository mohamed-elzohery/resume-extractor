import { z } from 'zod';
import { Extractor } from '../Extractor';
import { EducationSchema } from '../../schemas/sections/EducationSchema';
import { EducationExtractionPromptTemplate } from '../../prompts/templates/education.prompt';

/**
 * Education extractor implementation for extracting educational background information.
 */
const defaultSchema = z.object({ educations: z.array(EducationSchema) });

export class EducationExtractor extends Extractor<typeof defaultSchema> {
    constructor(
        prompt: string = EducationExtractionPromptTemplate,
        schema: typeof defaultSchema = defaultSchema
    ) {
        super(prompt, schema);
    }
}
