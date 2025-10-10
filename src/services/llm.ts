import type { ZodSchema } from 'zod/v3';
import dotenv from 'dotenv';
import type { ResumeFile } from '../types/extractor.types';
import OpenAI from 'openai';
import { zodResponseFormat, zodTextFormat } from 'openai/helpers/zod.mjs';
import { toFile } from 'openai/uploads';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_SYSTEM_PROMPT = 'You are an accurate resume extractor assistant.';

const toUploadable = async (file: ResumeFile) => {
    const mimeType = file.mimeType ?? 'application/octet-stream';
    return toFile(file.data, file.name, { type: mimeType });
};

export interface LLMExtractionOptions {
    schema: ZodSchema;
    prompt: string;
    files: ResumeFile[];
    systemPrompt?: string;
}

export const extractWithLLM = async ({
    schema,
    prompt,
    files,
    systemPrompt,
}: LLMExtractionOptions) => {
    let uploadedFiles: Awaited<ReturnType<typeof openai.files.create>>[] = [];

    try {
        uploadedFiles = await Promise.all(
            files.map(async (file) => {
                console.log(`Uploading resume: ${file.name}`);
                const prepared = await toUploadable(file);

                return openai.files.create({
                    file: prepared,
                    purpose: 'user_data',
                });
            })
        );

        if (uploadedFiles.length === 0) {
            throw new Error('No files were provided for extraction.');
        }

        console.log('Starting extraction with file ids:', uploadedFiles.map((f) => f.id));

        const response = await openai.responses.parse({
            model: 'gpt-4o-mini',
            temperature: 0,
            input: [
                {
                    role: 'system',
                    content: systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
                },
                {
                    role: 'user',
                    content: [
                        ...uploadedFiles.map((fileUpload) => ({
                            type: 'input_file' as const,
                            file_id: fileUpload.id,
                        })),
                        {
                            type: 'input_text' as const,
                            text: prompt,
                        },
                    ],
                },
            ], text: {
                format: zodTextFormat(schema, 'resume'),
            },
        });

        return (response.output_parsed) as any;
    } catch (error) {
        console.error('Error during extraction:', error);
        throw error;
    } finally {
        await Promise.allSettled(
            uploadedFiles.map(async (fileUpload) => {
                try {
                    await openai.files.delete(fileUpload.id);
                } catch (deleteError) {
                    console.warn(`Failed to delete uploaded file ${fileUpload.id}:`, deleteError);
                }
            })
        );
    }
};

