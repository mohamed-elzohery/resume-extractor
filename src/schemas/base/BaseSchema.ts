// Base schema interface
import { z } from 'zod';

export const DateSchema = z.object({
    year: z.number().nullable(),
    month: z.number().min(1).max(12).nullable().describe("Month as a number between 1 and 12")
});
export type DateType = z.infer<typeof DateSchema>;