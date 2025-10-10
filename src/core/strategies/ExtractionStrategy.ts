import type { Extractor } from '../../extractors/Extractor';

export interface StrategyContext {
    extractors: Extractor[];
    fileIds: string[];
    systemPrompt?: string;
}

export interface ExtractionStrategy {
    run(context: StrategyContext): Promise<Record<string, unknown>>;
}
