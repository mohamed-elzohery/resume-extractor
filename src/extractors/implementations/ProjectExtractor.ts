import { BaseExtractor } from '../base/BaseExtractor';
import { ProjectSchema } from '../../schemas/sections/ProjectSchema';
import { ProjectsExtractionPromptTemplate } from '../../prompts/templates/projects.prompt';
import { z } from 'zod';

/**
 * Project extractor implementation for extracting project experience and portfolio.
 */
export class ProjectExtractor extends BaseExtractor {
    getSchema(): any {
        return ProjectSchema;
    }

    getPromptTemplate(): string {
        return ProjectsExtractionPromptTemplate;
    }

    getOutputFormat(): "array" | "object" {
        return "array";
    }
}