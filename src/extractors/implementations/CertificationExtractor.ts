import { z } from 'zod';
import { Extractor } from '../Extractor';
import { CertificationSchema } from '../../schemas/sections/CertificationSchema';
import { CertificationExtractionPromptTemplate } from '../../prompts/templates/certification.prompt';

/**
 * Certification extractor implementation for extracting professional certifications and licenses.
 */
const defaultSchema = z.object({ certifications: z.array(CertificationSchema) });

export class CertificationExtractor extends Extractor<typeof defaultSchema> {
    constructor(
        prompt: string = CertificationExtractionPromptTemplate,
        schema: typeof defaultSchema = defaultSchema
    ) {
        super(prompt, schema);
    }
}
