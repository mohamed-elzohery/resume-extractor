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

const client = new ResumeExtractionClient('batch_calls');
const files = loadSampleFiles();
const builtInKeys = ExtractorRegistry.list() as BuiltInExtractorKey[];

describe('ResumeExtractionClient (batch mode)', () => {
    beforeEach(() => {
        resetLLMMock();
    });

    it('returns schema-shaped data when extracting all built-ins in a single call', async () => {
        const aggregated = Object.fromEntries(
            builtInKeys.map((key) => [key, getSampleOutput(key)])
        );
        setLLMSequence([aggregated]);

        const result = await client.extract({
            files,
            extractors: builtInKeys.map((key) => ({ extractor: key })),
        });

        builtInKeys.forEach((key) => {
            const schema = getSchemaForExtractor(key);
            expectMatchesSchema((result as Record<string, unknown>)[key], schema);
        });

        expect(getLLMMock()).toHaveBeenCalledTimes(1);
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

    it('merges selected extractors into one response with defaults', async () => {
        const keys: BuiltInExtractorKey[] = ['education', 'experience', 'contact'];
        const aggregated = Object.fromEntries(keys.map((key) => [key, getSampleOutput(key)]));
        setLLMSequence([aggregated]);

        const result = await client.extract({
            files,
            extractors: keys.map((key) => ({ extractor: key })),
        });

        keys.forEach((key) => {
            const schema = getSchemaForExtractor(key);
            expectMatchesSchema((result as Record<string, unknown>)[key], schema);
        });
        expect(getLLMMock()).toHaveBeenCalledTimes(1);
    });

    it('respects overrides and custom result keys when batching', async () => {
        const educationSchema = z.object({ entries: z.array(z.object({ school: z.string() })) });
        const experienceSchema = z.object({ roles: z.array(z.object({ title: z.string() })) });
        const contactSchema = z.object({ name: z.string(), email: z.string().nullable() });

        const aggregated = {
            educationData: { entries: [{ school: 'Override University' }] },
            experienceData: { roles: [{ title: 'Override Role' }] },
            contactCard: { name: 'Jane Doe', email: 'jane.doe@example.com' },
        };
        setLLMSequence([aggregated]);

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
        expect(getLLMMock()).toHaveBeenCalledTimes(1);
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
                client.extract({
                    files,
                    extractors: [
                        {
                            extractor: 'education',
                            schema: z.array(z.object({ school: z.string() })),
                        } as unknown as ExtractorSelection,
                    ],
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
