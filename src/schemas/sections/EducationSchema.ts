import { z } from 'zod';
import { DateSchema } from '../base/BaseSchema';

export const EducationSchema = z.array(z.object({
    school: z.string().describe("the educational institution, university, college, or training center where the candidate studied"),
    degree: z.string().nullable().describe("the academic degree, diploma, or certification obtained, such as 'Bachelor of Science', 'Master of Business Administration', or 'High School Diploma' or 'Diploma"),
    field_of_study: z.string().nullable().describe("the specific academic discipline or major area of study, such as 'Computer Science', 'Business Administration', or 'Mechanical Engineering'"),
    description: z.string().nullable().describe("additional details about the educational experience, including relevant coursework, academic achievements, activities, thesis topics, or notable projects"),
    start_date: DateSchema.nullable().describe("the date when the candidate began their studies at this institution"),
    end_date: DateSchema.nullable().describe("the date when the candidate completed their studies or graduated from this institution")
}).describe("Focusing on the formal education section that highlights the candidate's academic background, degrees earned, institutions attended, and relevant coursework or honors."));

export type Education = z.infer<typeof EducationSchema>;
