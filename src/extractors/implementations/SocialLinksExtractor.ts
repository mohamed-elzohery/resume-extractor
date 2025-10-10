import { z } from 'zod';
import { Extractor } from '../Extractor';
import { SocialLinkSchema } from '../../schemas/sections/SocialLinksSchema';
import { SocialLinksExtractionPromptTemplate } from '../../prompts/templates/social-links.prompt';

/**
 * Social links extractor implementation responsible for capturing online profile references.
 */
const defaultSchema = z.object({ social_links: z.array(SocialLinkSchema) });

export class SocialLinksExtractor extends Extractor<typeof defaultSchema> {
    constructor(
        prompt: string = SocialLinksExtractionPromptTemplate,
        schema: typeof defaultSchema = defaultSchema
    ) {
        super(prompt, schema);
    }
}
