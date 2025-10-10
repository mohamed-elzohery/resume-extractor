import { z } from 'zod';
import { LocationSchema } from '../base/BaseSchemas';

export const ContactSchema = z.object({
    first_name: z.string().describe("Given name or first name of the individual.like 'John', 'Jane', 'Alice', 'Michael'").nullable().default(null),
    last_name: z.string().nullable().describe("Family name or last name of the individual. like 'Doe', 'Smith', 'Johnson', 'Brown'").default(null),
    phone: z.string().nullable().describe("Phone number for contacting the individual.").default(null),
    title: z.string().nullable().describe("Professional title or designation, such as 'Software Engineer', 'Marketing Specialist' or 'Accountant'").default(null),
    location: LocationSchema.nullable().default(null),
    email: z.string().email().nullable().default(null)
});

export type Contact = z.infer<typeof ContactSchema>;
