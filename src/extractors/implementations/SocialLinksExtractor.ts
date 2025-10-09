import { z } from 'zod';
import { BaseExtractor } from '../base/BaseExtractor';
import { SocialLinkSchema } from '../../schemas/sections/SocialLinksSchema';
import { SocialLinksExtractionPromptTemplate } from '../../prompts/templates/social-links.prompt';

/**
 * Social links extractor implementation responsible for capturing online profile references.
 */
export class SocialLinksExtractor extends BaseExtractor {
    getSchema(): any {
        return z.array(SocialLinkSchema);
    }

    getPromptTemplate(): string {
        return SocialLinksExtractionPromptTemplate;
    }

    getOutputFormat(): "array" | "object" {
        return "array";
    }
}
