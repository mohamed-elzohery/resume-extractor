import { BaseExtractor } from '../base/BaseExtractor';
import { HonorsSchema } from '../../schemas/sections/HonorsSchema';
import { HonorsExtractionPromptTemplate } from '../../prompts/templates/honors.prompt';
import { z } from 'zod';

/**
 * Honors extractor implementation for extracting awards, honors, and recognitions.
 */
export class HonorsExtractor extends BaseExtractor {
    getSchema(): any {
        return z.array(HonorsSchema);
    }

    getPromptTemplate(): string {
        return HonorsExtractionPromptTemplate;
    }

    getOutputFormat(): "array" | "object" {
        return "array";
    }
}