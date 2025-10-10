import { z } from 'zod';
import { Extractor } from '../Extractor';
import { LanguageSchema } from '../../schemas/sections/LanguageSchema';
import { LanguagesExtractionPromptTemplate } from '../../prompts/templates/language.prompt';

/**
 * Language extractor implementation for extracting language proficiencies.
 */
const defaultSchema = z.object({ languages: z.array(LanguageSchema) });

export class LanguageExtractor extends Extractor<typeof defaultSchema> {
    constructor(
        prompt: string = LanguagesExtractionPromptTemplate,
        schema: typeof defaultSchema = defaultSchema
    ) {
        super(prompt, schema);
    }
}
