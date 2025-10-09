import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { resetLLMMock, setLLMSequence, getLLMMock } from './utils/llmMock';
import { ResumeExtractionClient } from '../src/core/DocumentProcessor';
import { ExtractorRegistry } from '../src/extractors/ExtractorRegistry';
import type { BuiltInExtractorKey, ExtractorSelection } from '../src/types/extractor.types';
import { loadSampleFiles, createFiles } from './utils/files';
import { getSampleOutput } from './utils/sampleOutputs';
import { getSchemaForExtractor } from './utils/extractors';
import { expectMatchesSchema } from './utils/assertions';
import { z } from 'zod/v3';

beforeAll(() => {
    process.env.OPENAI_API_KEY = 'test-key';
});

const client = new ResumeExtractionClient('parallel_calls');
const files = loadSampleFiles();

const builtInKeys = ExtractorRegistry.list() as BuiltInExtractorKey[];

describe('ResumeExtractionClient (parallel mode)', () => {
    beforeEach(() => {
        resetLLMMock();
    });

    it('returns schema-shaped data when extracting all built-ins', async () => {
        setLLMSequence(builtInKeys.map((key) => getSampleOutput(key)));

        const extractors = builtInKeys.map((key) => ({ extractor: key }));
        const result = await client.extract({ files, extractors });

        builtInKeys.forEach((key) => {
            const schema = getSchemaForExtractor(key);
            expectMatchesSchema((result as Record<string, unknown>)[key], schema);
        });

        expect(getLLMMock()).toHaveBeenCalledTimes(builtInKeys.length);
    });

    it('runs a single extractor without overrides', async () => {
        setLLMSequence([getSampleOutput('experience')]);

        const result = await client.extractOne({
            files,
            extractor: 'experience',
        });

        const schema = getSchemaForExtractor('experience');
        expectMatchesSchema(result, schema);
        expect(getLLMMock()).toHaveBeenCalledTimes(1);
    });

    it('runs selected extractors in parallel with defaults', async () => {
        const keys: BuiltInExtractorKey[] = ['education', 'experience', 'contact'];
        setLLMSequence(keys.map((key) => getSampleOutput(key)));

        const result = await client.extract({
            files,
            extractors: keys.map((key) => ({ extractor: key })),
        });

        keys.forEach((key) => {
            const schema = getSchemaForExtractor(key);
            expectMatchesSchema((result as Record<string, unknown>)[key], schema);
        });
        expect(getLLMMock()).toHaveBeenCalledTimes(keys.length);
    });

    it('respects overrides for prompts, schemas, output format, and result keys', async () => {
        const educationSchema = z.object({ entries: z.array(z.object({ school: z.string() })) });
        const experienceSchema = z.object({ roles: z.array(z.object({ title: z.string() })) });
        const contactSchema = z.object({ name: z.string(), email: z.string().nullable() });

        setLLMSequence([
            { entries: [{ school: 'Override University' }] },
            { roles: [{ title: 'Override Role' }] },
            { name: 'Jane Doe', email: 'jane.doe@example.com' },
        ]);

        const overrideSelections = [
            {
                extractor: 'education',
                prompt: 'custom education prompt',
                schema: educationSchema,
                outputFormat: 'object',
                resultKey: 'educationData',
            } satisfies ExtractorSelection<typeof educationSchema, 'educationData'>,
            {
                extractor: 'experience',
                prompt: 'custom experience prompt',
                schema: experienceSchema,
                outputFormat: 'object',
                resultKey: 'experienceData',
            } satisfies ExtractorSelection<typeof experienceSchema, 'experienceData'>,
            {
                extractor: 'contact',
                prompt: 'custom contact prompt',
                schema: contactSchema,
                outputFormat: 'object',
                resultKey: 'contactCard',
            } satisfies ExtractorSelection<typeof contactSchema, 'contactCard'>,
        ] as const;

        const result = await client.extract({
            files,
            extractors: overrideSelections as unknown as ExtractorSelection[],
        });

        expectMatchesSchema((result as Record<string, unknown>)['educationData'], educationSchema);
        expectMatchesSchema((result as Record<string, unknown>)['experienceData'], experienceSchema);
        expectMatchesSchema((result as Record<string, unknown>)['contactCard'], contactSchema);
        expect(getLLMMock()).toHaveBeenCalledTimes(3);
    });

    describe('error handling', () => {
        it('throws when no files are provided', async () => {
            setLLMSequence([]);
            await expect(
                client.extract({ files: [], extractors: [{ extractor: 'experience' }] })
            ).rejects.toThrow('At least one resume file is required for extraction.');
            expect(getLLMMock()).not.toHaveBeenCalled();
        });

        it('rejects unsupported file formats', async () => {
            await expect(
                client.extract({
                    files: createFiles([{ mimeType: 'text/plain' }]),
                    extractors: [{ extractor: 'contact' }],
                })
            ).rejects.toThrow('Unsupported file mime type');
            expect(getLLMMock()).not.toHaveBeenCalled();
        });

        it('surfaces schema validation failures from LLM', async () => {
            setLLMSequence([new Error('Schema validation failed')]);
            await expect(
                client.extractOne({
                    files,
                    extractor: 'education',
                    schema: z.array(z.object({ school: z.string() })),
                })
            ).rejects.toThrow('Schema validation failed');
        });

        it('throws when extractor key is not registered', async () => {
            await expect(
                client.extract({
                    files,
                    extractors: [{ extractor: 'non-existent-extractor' } as any],
                })
            ).rejects.toThrow('Extractor "non-existent-extractor" is not registered.');
        });
    });
});
