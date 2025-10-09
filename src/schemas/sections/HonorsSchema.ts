import { z } from 'zod';

export const HonorsSchema = z.object({
    title: z.string().describe("Title of the honor/Achievements/awards"),
    date: z.string().nullable().describe("Date of the honor"),
    issuer: z.string().nullable().describe("Issuer of the honor"),
    description: z.string().nullable().describe("Description of the honor")
}).describe("can be honor/Achievements/awards that highlights recognitions that set the candidate apart, such as 'Employee of the Month,' industry awards, or academic scholarships.").partial();

export type Honors = z.infer<typeof HonorsSchema>;