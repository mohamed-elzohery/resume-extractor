import type { ZodSchema } from 'zod';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod.mjs';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_SYSTEM_PROMPT = 'You are an accurate resume extractor assistant.';

export const getOpenAIClient = () => openai;

export interface LLMExtractionOptions {
    schema: ZodSchema;
    prompt: string;
    fileIds: string[];
    systemPrompt?: string;
}

export const extractWithLLM = async ({
    schema,
    prompt,
    fileIds,
    systemPrompt,
}: LLMExtractionOptions) => {
    if (!fileIds.length) {
        throw new Error('No file ids were provided for extraction.');
    }
    try {
        const textFormat = zodTextFormat(schema, 'resume');
        sanitizeRefKeywords(textFormat);

        const response = await openai.responses.parse({
            model: 'gpt-4.1-mini-2025-04-14',
            temperature: 0.1,
            input: [
                {
                    role: 'system',
                    content: systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
                },
                {
                    role: 'user',
                    content: [
                        ...fileIds.map((fileId) => ({
                            type: 'input_file' as const,
                            file_id: fileId,
                        })),
                        {
                            type: 'input_text' as const,
                            text: prompt,
                        },
                    ],
                },
            ],
            text: {
                format: textFormat,
            },
        });
        console.log("response", response.usage)
        return response.output_parsed as unknown;
    } catch (error) {
        console.error('Error during extraction:', error);
        throw error;
    }
};


const sanitizeRefKeywords = (format: ReturnType<typeof zodTextFormat>) => {
    stripInvalidRefKeywords(format);
};

const stripInvalidRefKeywords = (node: unknown): void => {
    if (Array.isArray(node)) {
        node.forEach(stripInvalidRefKeywords);
        return;
    }

    if (node && typeof node === 'object') {
        const record = node as Record<string, unknown>;

        if (typeof record.$ref === 'string') {
            delete record.description;
            delete record.default;
        }

        Object.values(record).forEach(stripInvalidRefKeywords);
    }
};

