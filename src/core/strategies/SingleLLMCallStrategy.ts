import { z } from 'zod';
import { extractWithLLM } from '../../services/llm';
import type { ExtractionStrategy, StrategyContext } from './ExtractionStrategy';

export class SingleLLMCallStrategy implements ExtractionStrategy {
    async run({ extractors, fileIds, systemPrompt }: StrategyContext): Promise<Record<string, unknown>> {
        if (!extractors.length) {
            return {};
        }

        const schema = extractors.reduce((comb, extractor) => {
            return comb.merge(extractor.getSchema());
        }, z.object({}));

        const prompt = buildCombinedPrompt(extractors);

        const result = await extractWithLLM({
            schema,
            prompt,
            fileIds,
            systemPrompt,
        });

        if (!isRecord(result)) {
            throw new Error('Batch extraction expected an object response matching the combined schema.');
        }

        return result;
    }
}

const buildCombinedPrompt = (extractors: StrategyContext['extractors']) => {
    const sections = extractors
        .map((extractor, index) => {
            const keys = extractor.getResultKeys().join(', ');
            const label = keys.length ? keys : extractor.constructor.name;
            return `### Section ${index + 1}: ${label}\n${extractor.getPrompt().trim()}`;
        })
        .join('\n\n');

    const keysList = extractors
        .flatMap((extractor) => extractor.getResultKeys())
        .map((key) => `- ${key}`)
        .join('\n');

    return `Extract the following resume sections with high fidelity.\n\n${sections}\n\nReturn a JSON object containing the following keys:\n${keysList}`;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);
