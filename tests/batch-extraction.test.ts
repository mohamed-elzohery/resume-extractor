import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import {
    resetLLMMock,
    setLLMSequence,
    setLLMHandler,
    getLLMMock,
    setUploadSequence,
    getUploadMocks,
} from './utils/llmMock';
import { Resume } from '../src/core/Resume';
import { Extractor } from '../src/extractors/Extractor';
import { ExperienceExtractor } from '../src/extractors/implementations/ExperienceExtractor';
import { EducationExtractor } from '../src/extractors/implementations/EducationExtractor';
import { loadSampleFiles } from './utils/files';
import { expectMatchesSchema } from './utils/assertions';
import { z } from 'zod';

beforeAll(() => {
    process.env.OPENAI_API_KEY = 'test-key';
});

const files = loadSampleFiles();

describe('Bulk runner batch strategy', () => {
    beforeEach(() => {
        resetLLMMock();
        setUploadSequence(['upload-1']);
    });

    it('combines prompts and schema when running batch_calls', async () => {
        const experience = new ExperienceExtractor();
        const education = new EducationExtractor();

        setLLMHandler((args) => {
            const shape = (args.schema as any).shape ?? {};
            expect(Object.keys(shape)).toEqual(['experience', 'education']);
            expect(args.prompt).toContain('Section 1: experience');
            expect(args.prompt).toContain('Section 2: education');
            return {
                experience: [{ company: 'Acme Inc.', title: 'Engineer' }],
                education: [{ school: 'State University', degree: 'BSc' }],
            };
        });

        const resume = new Resume(files);
        const result = await resume
            .extract([experience, education])
            .run({ strategy: 'batch_calls' });

        expectMatchesSchema((result as Record<string, unknown>).experience, experience.getSchema());
        expectMatchesSchema((result as Record<string, unknown>).education, education.getSchema());
        expect(getLLMMock()).toHaveBeenCalledTimes(1);
    });

    it('uploads and deletes files even when extraction fails', async () => {
        const { uploadMock, deleteMock } = getUploadMocks();
        setLLMSequence([new Error('Failed to parse')]);

        const resume = new Resume(files);

        await expect(resume.extract(['experience']).run({ strategy: 'batch_calls' })).rejects.toThrow(
            'Failed to parse'
        );

        expect(uploadMock).toHaveBeenCalledTimes(files.length);
        expect(deleteMock).toHaveBeenCalledTimes(files.length);
    });

    it('supports custom composite extractors with bespoke schemas', async () => {
        const achievements = new Extractor(
            'achievements',
            'Extract two notable achievements.',
            z.object({ achievements: z.array(z.string().min(1)).length(2) })
        );
        const skills = new Extractor(
            'skills',
            'List the primary skills.',
            z.object({ skills: z.array(z.string()) })
        );

        const response = {
            achievements: { achievements: ['Won hackathon', 'Published research'] },
            skills: { skills: ['TypeScript', 'Node.js'] },
        };
        setLLMSequence([response]);

        const resume = new Resume(files);
        const result = await resume.extract([achievements, skills]).run({ strategy: 'batch_calls' });

        expectMatchesSchema((result as Record<string, unknown>).achievements, achievements.getSchema());
        expectMatchesSchema((result as Record<string, unknown>).skills, skills.getSchema());
        expect(getLLMMock()).toHaveBeenCalledTimes(1);
    });
});
