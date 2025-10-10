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
import { ResumeExtractionClient } from '../src/core/DocumentProcessor';
import { ExtractorRegistry } from '../src/extractors/ExtractorRegistry';
import { EducationExtractor } from '../src/extractors/implementations/EducationExtractor';
import { Extractor } from '../src/extractors/Extractor';
import type { BuiltInExtractorKey } from '../src/types/extractor.types';
import { loadSampleFiles } from './utils/files';
import { getSampleOutput } from './utils/sampleOutputs';
import { getSchemaForExtractor } from './utils/extractors';
import { expectMatchesSchema } from './utils/assertions';
import { z } from 'zod';

beforeAll(() => {
    process.env.OPENAI_API_KEY = 'test-key';
});

const files = loadSampleFiles();
const builtInKeys = ExtractorRegistry.list() as BuiltInExtractorKey[];

describe('Resume extraction workflow', () => {
    beforeEach(() => {
        resetLLMMock();
        setUploadSequence(['upload-a', 'upload-b', 'upload-c', 'upload-d', 'upload-e']);
    });

    it('extracts all registered sections in parallel', async () => {
        setLLMSequence(builtInKeys.map((key) => getSampleOutput(key)));

        const resume = new Resume(files);
        const runner = resume.extract(builtInKeys);
        const result = await runner.run({ strategy: 'parallel_calls' });

        builtInKeys.forEach((key) => {
            const schema = getSchemaForExtractor(key);
            expectMatchesSchema((result as Record<string, unknown>)[key], schema);
        });

        expect(getLLMMock()).toHaveBeenCalledTimes(builtInKeys.length);
        const { uploadMock, deleteMock } = getUploadMocks();
        expect(uploadMock).toHaveBeenCalledTimes(files.length);
        expect(deleteMock).toHaveBeenCalledTimes(files.length);
    });

    it('supports the single-prompt alias for batch execution', async () => {
        const keys: BuiltInExtractorKey[] = ['education', 'experience'];
        const educationOutput = getSampleOutput('education') as any;
        const experienceOutput = getSampleOutput('experience') as any;
        const batchResponse = {
            education: educationOutput.education,
            experience: experienceOutput.experience,
        };
        setLLMSequence([batchResponse]);

        const resume = new Resume(files);
        const result = await resume
            .extract(keys)
            .run({ strategy: 'single-prompt', systemPrompt: 'custom-system' });

        keys.forEach((key) => {
            const schema = getSchemaForExtractor(key);
            expectMatchesSchema((result as Record<string, unknown>)[key], schema);
        });

        expect(getLLMMock()).toHaveBeenCalledTimes(1);
    });

    it('allows overriding built-in extractors and adding custom ones', async () => {
        const education = new EducationExtractor('education');
        education.setPrompt('Only return postgraduate education.');
        const custom = new Extractor(
            'custom_section',
            'Extract a list of accomplishments.',
            z.object({ accomplishments: z.array(z.string()) })
        );

        setLLMSequence([
            { education: [{ school: 'Override University', degree: 'MSc' }] },
            { accomplishments: ['Built the new extraction pipeline'] },
        ]);

        const resume = new Resume(files);
        const result = await resume.extract(['education', custom]).run();

        expectMatchesSchema((result as Record<string, unknown>)['education'], education.getSchema());
        expectMatchesSchema(
            (result as Record<string, unknown>)['custom_section'],
            custom.getSchema()
        );

        const calls = getLLMMock().mock.calls;
        expect(calls[0][0].prompt).toContain('Only return postgraduate education');
        expect(calls[1][0].prompt).toContain('accomplishments');
    });

    it('passes normalized strategy values through ResumeExtractionClient wrapper', async () => {
        const client = new ResumeExtractionClient('single_calls');
        setLLMSequence([getSampleOutput('experience')]);

        const result = await client.extract({
            files,
            extractors: ['experience'],
            context: { strategy: 'single-prompt' },
        });

        expectMatchesSchema((result as Record<string, unknown>)['experience'], getSchemaForExtractor('experience'));
        expect(getLLMMock()).toHaveBeenCalledTimes(1);
    });

    it('throws if resume is created without files', () => {
        expect(() => new Resume([])).toThrow('Resume must be initialised with at least one file.');
    });
});
