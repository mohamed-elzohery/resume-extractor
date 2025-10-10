import { z } from 'zod';
import { DateSchema } from '../base/BaseSchemas';

export const ProjectSchema = z.object({
    name: z.string().nullable().describe("The project title or name, such as 'E-commerce Website', 'Mobile Banking App', or 'Data Analytics Dashboard'").default(null),
    start_date: DateSchema.nullable().describe("The date when the project commenced or when the candidate began working on it"),
    end_date: DateSchema.nullable().describe("The date when the project was completed or when the candidate's involvement ended. Null if the project is ongoing"),
    description: z.string().nullable().describe("A detailed description of the project including objectives, technologies used, challenges overcome, and outcomes achieved"),
    associated_employer: z.string().nullable().describe("The company, organization, or employer associated with this project. Can be null for personal or academic projects")
}).describe("Personal, professional, or academic projects that showcase the candidate's practical application of skills and demonstrate their ability to deliver results")

export type Project = z.infer<typeof ProjectSchema>;