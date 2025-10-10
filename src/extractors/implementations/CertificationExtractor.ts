import { BaseExtractor } from '../base/BaseExtractor';
import { CertificationSchema } from '../../schemas/sections/CertificationSchema';
import { CertificationExtractionPromptTemplate } from '../../prompts/templates/certification.prompt';
import { z } from 'zod';

/**
 * Certification extractor implementation for extracting professional certifications and licenses.
 */
export class CertificationExtractor extends BaseExtractor {
    getSchema(): any {
        return z.object({ certifications: z.array(CertificationSchema) });
    }

    getPromptTemplate(): string {
        return CertificationExtractionPromptTemplate;
    }
}
