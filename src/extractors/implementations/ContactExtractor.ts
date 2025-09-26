import { BaseExtractor } from '../base/BaseExtractor';
import { ContactSchema } from '../../schemas/sections/ContactSchema';
import { ContactExtractionPromptTemplate } from '../../prompts/templates/contact.prompt';

/**
 * Contact extractor implementation for extracting personal contact information.
 */
export class ContactExtractor extends BaseExtractor {
    getSchema(): any {
        return ContactSchema;
    }

    getPromptTemplate(): string {
        return ContactExtractionPromptTemplate;
    }

    getOutputFormat(): "array" | "object" {
        return "object";
    }
}
