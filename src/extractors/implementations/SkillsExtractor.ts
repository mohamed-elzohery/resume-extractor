import { z } from 'zod';
import { Extractor } from '../Extractor';
import { SkillsSchema } from '../../schemas/sections/SkillsSchema';
import { SkillsExtractionPromptTemplate } from '../../prompts/templates/skills.prompt';

/**
 * Skills extractor implementation for extracting technical and soft skills.
 */
const defaultSchema = z.object({ skills: z.array(SkillsSchema) });

export class SkillsExtractor extends Extractor<typeof defaultSchema> {
    constructor(
        prompt: string = SkillsExtractionPromptTemplate,
        schema: typeof defaultSchema = defaultSchema
    ) {
        super(prompt, schema);
    }
}
