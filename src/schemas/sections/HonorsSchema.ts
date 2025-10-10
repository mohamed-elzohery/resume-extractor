import { z } from 'zod';

export const HonorsSchema = z.object({
    title: z.string().nullable().describe("Title of the honor/Achievements/awards").default(null),
    date: z.string().nullable().describe("Date of the honor").default(null),
    issuer: z.string().nullable().describe("Issuer of the honor").default(null),
    description: z.string().nullable().describe("Description of the honor").default(null)
}).describe("can be honor/Achievements/awards that highlights recognitions that set the candidate apart, such as 'Employee of the Month,' industry awards, or academic scholarships.")

export type Honors = z.infer<typeof HonorsSchema>;