import { BaseExtractor } from '../base/BaseExtractor';
import { LanguageSchema } from '../../schemas/sections/LanguageSchema';
import { LanguagesExtractionPromptTemplate } from '../../prompts/templates/language.prompt';

/**
 * Language extractor implementation for extracting language proficiencies.
 */
export class LanguageExtractor extends BaseExtractor {
    getSchema(): any {
        return LanguageSchema;
    }

    getPromptTemplate(): string {
        return LanguagesExtractionPromptTemplate;
    }

    getOutputFormat(): "array" | "object" {
        return "array";
    }
}
