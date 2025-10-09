import { z } from 'zod';
import type { nullable } from 'zod/v4';

export const SummarySchema = z.object({
    title: z.string().describe("A brief, attention-grabbing headline that encapsulates the candidate's professional identity and career goals.").default("Professional Summary"),
    short_summary: z.string().nullable().describe("A concise summary of the candidate's professional background and skills.").default(""),
    full_summary: z.string().nullable().describe("the summary section, objective, profile, or personal statement at the top of a resume that provides an overview of the candidate's qualifications, career goals, and what they bring to potential employers.").default("")
}).describe("Summary/Objective/Profile/Personal Statement section that provides a snapshot of the candidate's professional identity, career goals, and key qualifications.");

export type Summary = z.infer<typeof SummarySchema>;
