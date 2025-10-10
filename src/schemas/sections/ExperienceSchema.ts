import { z } from 'zod';
import { DateSchema } from '../base/BaseSchemas';

export const ExperienceSchema = z.object({
    title: z.string().describe("Exact job title as written in the resume, like 'Senior Software Engineer'.").nullable().default(null),
    company: z.string().nullable().describe("Full company name exactly as written in the resume.").default(null),
    location: z.string().nullable().describe("The location of the job. This could be a city, state, or country. Also, it can be remote."),
    employment_type: z.string().nullable().describe("The type of employment, such as 'Full-time', 'Part-time', 'Contract', etc.").default(null),
    description: z.string().nullable().describe("A brief description of the job responsibilities and achievements.").default(null),
    start_date: DateSchema.nullable().default(null),
    end_date: DateSchema.nullable().default(null),
    department: z.string().nullable().describe("Specific department, division, or team if mentioned.").default(null),
    is_current: z.boolean().nullable().default(null)
}).describe("Work Experience / Professional Experience / Employment History")

export type Experience = z.infer<typeof ExperienceSchema>;
