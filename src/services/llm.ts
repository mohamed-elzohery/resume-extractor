import { generateObject } from 'ai';
import type { ZodSchema } from 'zod/v3';
import { openai } from '@ai-sdk/openai';
import dotenv from 'dotenv'
import { readFileSync } from 'fs';

dotenv.config();

export const extractWithLLM = async (schema: ZodSchema, prompt: string, output: "array" | "object") => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("Missing OPENAI_API_KEY in environment variables");
    }
    const model = openai("gpt-4o-mini")
    const { object } = await generateObject({
        model,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "file",
                        mediaType: "application/pdf",
                        // temp
                        data: "https://rxresu.me/templates/pdf/nosepass.pdf"
                    },
                    { type: "text", text: prompt }
                ]
            }
        ],
        schema,
        output,
        maxRetries: 0,
        mode: "json",
        temperature: 0,
    });

    return object;
}

