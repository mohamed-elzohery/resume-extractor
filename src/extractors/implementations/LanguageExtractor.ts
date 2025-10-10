import { BaseExtractor } from '../base/BaseExtractor';
import { LanguageSchema } from '../../schemas/sections/LanguageSchema';
import { LanguagesExtractionPromptTemplate } from '../../prompts/templates/language.prompt';
import z from 'zod';

/**
 * Language extractor implementation for extracting language proficiencies.
 */
export class LanguageExtractor extends BaseExtractor {
    getSchema(): any {
        return z.array(LanguageSchema);
    }
    getPromptTemplate(): string {
        return LanguagesExtractionPromptTemplate;
    }
}
