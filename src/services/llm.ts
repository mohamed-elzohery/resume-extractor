import { generateObject } from 'ai';
import type { ZodSchema } from 'zod/v3';
import { openai } from '@ai-sdk/openai';
import dotenv from 'dotenv';
import type { ResumeFile } from '../types/extractor.types';

dotenv.config();

const model = openai('gpt-4o-mini');

export interface LLMExtractionOptions {
    schema: ZodSchema;
    prompt: string;
    files: ResumeFile[];
    output: 'array' | 'object';
    systemPrompt?: string;
}

export const extractWithLLM = async ({
    schema,
    prompt,
    files,
    output,
    systemPrompt,
}: LLMExtractionOptions) => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('Missing OPENAI_API_KEY in environment variables');
    }

    if (!files.length) {
        throw new Error('At least one resume file is required for extraction.');
    }

    const messages: any[] = [];

    if (systemPrompt) {
        messages.push({
            role: 'system',
            content: [{ type: 'text', text: systemPrompt }],
        });
    }

    const fileParts = files.map((file) => ({
        type: 'file',
        name: file.name,
        mimeType: file.mimeType ?? 'application/pdf',
        data: file.data,
    }));

    messages.push({
        role: 'user',
        content: fileParts,
    });

    messages.push({
        role: 'user',
        content: [{ type: 'text', text: prompt.trim() }],
    });

    const { object } = await generateObject({
        model,
        messages,
        schema,
        output,
        maxRetries: 0,
        mode: 'json',
        temperature: 0,
    });

    return object;
};

