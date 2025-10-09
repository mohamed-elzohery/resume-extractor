import { z } from 'zod';

export const SkillsSchema = z.object({
    name: z.string().describe("The specific skill name such as 'JavaScript', 'Project Management', 'Data Analysis', or 'Adobe Photoshop'"),
    level: z.number().min(1).max(10).default(5).describe("Proficiency level on a scale from 1 (beginner) to 10 (expert/advanced). This represents the candidate's self-assessed competency in this skill")
}).describe("Technical and soft skills.").partial();

export type Skills = z.infer<typeof SkillsSchema>;
