import { z } from 'zod';
import { Extractor } from '../Extractor';
import { ProjectSchema } from '../../schemas/sections/ProjectSchema';
import { ProjectsExtractionPromptTemplate } from '../../prompts/templates/projects.prompt';

/**
 * Project extractor implementation for extracting project experience and portfolio.
 */
const defaultSchema = z.object({ projects: z.array(ProjectSchema) });

export class ProjectExtractor extends Extractor<typeof defaultSchema> {
    constructor(
        prompt: string = ProjectsExtractionPromptTemplate,
        schema: typeof defaultSchema = defaultSchema
    ) {
        super(prompt, schema);
    }
}