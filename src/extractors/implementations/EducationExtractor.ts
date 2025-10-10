import { BaseExtractor } from '../base/BaseExtractor';
import { EducationSchema } from '../../schemas/sections/EducationSchema';
import { EducationExtractionPromptTemplate } from '../../prompts/templates/education.prompt';
import { z } from 'zod';

/**
 * Education extractor implementation for extracting educational background information.
 */
export class EducationExtractor extends BaseExtractor {
    getSchema(): any {
        return z.object({ education: z.array(EducationSchema) });
    }

    getPromptTemplate(): string {
        return EducationExtractionPromptTemplate;
    }
}
