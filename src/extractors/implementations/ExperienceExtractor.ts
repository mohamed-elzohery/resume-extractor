import { BaseExtractor } from '../base/BaseExtractor';
import { ExperienceSchema } from '../../schemas/sections/ExperienceSchema';
import { ExperianceExtractionPromptTemplate } from '../../prompts/templates/experience.prompt';
import { z } from 'zod';

/**
 * Experience extractor implementation for extracting work experience information.
 */
export class ExperienceExtractor extends BaseExtractor {
    getSchema(): any {
        return ExperienceSchema;
    }

    getPromptTemplate(): string {
        return ExperianceExtractionPromptTemplate;
    }

    getOutputFormat(): "array" | "object" {
        return "array";
    }
}
