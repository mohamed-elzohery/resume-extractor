import { z } from 'zod';
import { LocationSchema } from '../base/BaseSchema';

export const ContactSchema = z.object({
    first_name: z.string().describe("Given name or first name of the individual.like 'John', 'Jane', 'Alice', 'Michael'"),
    last_name: z.string().nullable().describe("Family name or last name of the individual. like 'Doe', 'Smith', 'Johnson', 'Brown'"),
    phone: z.string().nullable().describe("Phone number for contacting the individual."),
    title: z.string().nullable().describe("Professional title or designation, such as 'Software Engineer', 'Marketing Specialist' or 'Accountant'"),
    location: LocationSchema.nullable(),
    email: z.email().nullable()
}).partial();

export type Contact = z.infer<typeof ContactSchema>;
