import type { ExtractionStrategy, StrategyContext } from './ExtractionStrategy';

export class ParallelExtractionStrategy implements ExtractionStrategy {
    async run({ extractors, fileIds, systemPrompt }: StrategyContext): Promise<Record<string, unknown>> {
        const results = await Promise.all(
            extractors.map((extractor) => extractor.run({ fileIds, systemPrompt }))
        );

        return results.reduce<Record<string, unknown>>((accumulator, current, index) => {
            if (!isRecord(current)) {
                const identifier = extractors[index]?.constructor?.name ?? `Extractor-${index}`;
                throw new Error(
                    `Extractor "${identifier}" returned a non-object result. Ensure its schema is a Zod object with named keys.`
                );
            }

            Object.assign(accumulator, current);
            return accumulator;
        }, {});
    }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);
