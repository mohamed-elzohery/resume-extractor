import { z } from 'zod';

export const SocialLinkSchema = z.object({
    platform: z.enum(["LinkedIn", "GitHub", "Twitter", "Facebook", "Instagram"]).describe("The social platform name, restricted to the supported enum values.").nullable().default(null),
    url: z.string().describe("The URL or username of the profile exactly as provided in the resume.").nullable().default(null),
    username: z.string().nullable().describe("The extracted username without any '@' prefix, if applicable.").default(null)
}).describe("A single social or professional presence shared by the candidate.");

export type SocialLink = z.infer<typeof SocialLinkSchema>;
