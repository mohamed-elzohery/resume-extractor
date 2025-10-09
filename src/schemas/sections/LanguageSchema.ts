import { z } from 'zod';

export const LanguageSchema = z.object({
    name: z.string(),
    proficiency: z.number().min(3).max(10).default(5).describe("this will from 3 Conversational level to 10 for fluent fluent")
}).partial();

export type Language = z.infer<typeof LanguageSchema>;
