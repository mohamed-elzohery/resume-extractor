import { BaseExtractor } from '../base/BaseExtractor';
import { SkillsSchema } from '../../schemas/sections/SkillsSchema';
import { SkillsExtractionPromptTemplate } from '../../prompts/templates/skills.prompt';
import { z } from 'zod';

/**
 * Skills extractor implementation for extracting technical and soft skills.
 */
export class SkillsExtractor extends BaseExtractor {
    getSchema(): any {
        return SkillsSchema;
    }

    getPromptTemplate(): string {
        return SkillsExtractionPromptTemplate;
    }

    getOutputFormat(): "array" | "object" {
        return "array";
    }
}
