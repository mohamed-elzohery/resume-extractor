import { z } from 'zod';
import { Extractor } from '../Extractor';
import { ContactSchema } from '../../schemas/sections/ContactSchema';
import { ContactExtractionPromptTemplate } from '../../prompts/templates/contact.prompt';

/**
 * Contact extractor implementation for extracting personal contact information.
 */
const defaultSchema = z.object({ contact: ContactSchema });

export class ContactExtractor extends Extractor<typeof defaultSchema> {
    constructor(
        prompt: string = ContactExtractionPromptTemplate,
        schema: typeof defaultSchema = defaultSchema
    ) {
        super(prompt, schema);
    }
}
