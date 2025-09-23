import { z } from 'zod';
import { DateSchema } from '../base/BaseSchema';

export const ExperienceSchema = z.object({
    title: z.string().describe("The specific job title or position, like 'Senior Software Engineer'."),
    company: z.string().nullable().describe("The name of the company or organization."),
    location: z.string().nullable().describe("The location of the job. This could be a city, state, or country. Also, it can be remote."),
    employment_type: z.string().nullable().describe("The type of employment, such as 'Full-time', 'Part-time', 'Contract', etc."),
    description: z.string().nullable().describe("A brief description of the job responsibilities and achievements."),
    start_date: DateSchema.nullable(),
    end_date: DateSchema.nullable(),
    is_current: z.boolean().nullable()
}).describe("Work Experience / Professional Experience / Employment History");

export type Experience = z.infer<typeof ExperienceSchema>;
