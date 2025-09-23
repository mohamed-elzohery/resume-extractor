import { z } from 'zod';

export const SummarySchema = z.object({
    title: z.string().describe("A brief, attention-grabbing headline that encapsulates the candidate's professional identity and career goals."),
    short_summary: z.string().describe("A concise summary of the candidate's professional background and skills."),
    full_summary: z.string().describe("the summary section, objective, profile, or personal statement at the top of a resume that provides an overview of the candidate's qualifications, career goals, and what they bring to potential employers.")
}).describe("Summary/Objective/Profile/Personal Statement section that provides a snapshot of the candidate's professional identity, career goals, and key qualifications.");

export type Summary = z.infer<typeof SummarySchema>;
