import { z } from 'zod';

export const CertificationSchema = z.object({
    name: z.string().nullable().describe("Name of the certification").default(null),
    organization: z.string().nullable().describe("Issuing organization").default(null),
    issue_date: z.string().nullable().describe("Issue date").default(null),
    expiration_date: z.string().nullable().describe("Expiration date").default(null),
    description: z.string().nullable().describe("any additional details about the certification").default(null),
    url: z.string().nullable().describe("URL to the certification").default(null)
}).describe("Certification and Licenses for example PMP, AWS Certified Solutions Architect")

export type Certification = z.infer<typeof CertificationSchema>;
