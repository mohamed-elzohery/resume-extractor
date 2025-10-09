import { z } from 'zod';

export const CertificationSchema = z.object({
    name: z.string().describe("Name of the certification"),
    organization: z.string().describe("Issuing organization"),
    issue_date: z.string().nullable().describe("Issue date"),
    expiration_date: z.string().nullable().describe("Expiration date"),
    description: z.string().describe("any additional details about the certification"),
    url: z.string().nullable().describe("URL to the certification")
}).describe("Certification and Licenses for example PMP, AWS Certified Solutions Architect").partial();

export type Certification = z.infer<typeof CertificationSchema>;
