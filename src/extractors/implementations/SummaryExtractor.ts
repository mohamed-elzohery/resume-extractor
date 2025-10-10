import { BaseExtractor } from '../base/BaseExtractor';
import { SummarySchema } from '../../schemas/sections/SummarySchema';
import { SummaryExtractionPromptTemplate } from '../../prompts/templates/summary.prompts';

/**
 * Summary extractor implementation for extracting professional summary, objective, or profile sections.
 */
export class SummaryExtractor extends BaseExtractor {
    getSchema(): any {
        return SummarySchema;
    }

    getPromptTemplate(): string {
        return SummaryExtractionPromptTemplate;
    }
}
