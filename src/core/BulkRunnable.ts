import { FileManager } from './FileManager';
import type { ResumeFile } from './ResumeFile';
import type { Extractor } from '../extractors/Extractor';
import type {
    BulkRunOptions,
    ExtractionStrategyName,
    HasStrategy,
    Runnable,
} from '../types/core.types';
import {
    ParallelExtractionStrategy,
    SingleLLMCallStrategy,
    type ExtractionStrategy,
} from './strategies';

const DEFAULT_STRATEGY: ExtractionStrategyName = 'parallel_calls';

const STRATEGY_FACTORIES: Record<ExtractionStrategyName, () => ExtractionStrategy> = {
    parallel_calls: () => new ParallelExtractionStrategy(),
    single_llm_call: () => new SingleLLMCallStrategy(),
};

export class BulkRunnable
    implements Runnable<BulkRunOptions, Record<string, unknown>>, HasStrategy<ExtractionStrategyName> {
    private strategy: ExtractionStrategyName = DEFAULT_STRATEGY;

    constructor(
        private readonly files: ResumeFile[],
        private readonly extractors: Extractor[]
    ) { }

    getStrategy(): ExtractionStrategyName {
        return this.strategy;
    }

    setStrategy(strategy: ExtractionStrategyName): void {
        this.strategy = this.validateStrategy(strategy);
    }

    async run(options: BulkRunOptions = {}): Promise<Record<string, unknown>> {
        if (!this.extractors.length) {
            return {};
        }

        const strategyName = this.validateStrategy(options.strategy ?? this.strategy);
        this.strategy = strategyName;

        let uploadedFileIds: string[] = [];

        try {
            uploadedFileIds = await FileManager.uploadFiles(this.files);
            const strategy = STRATEGY_FACTORIES[strategyName]();

            return await strategy.run({
                extractors: this.extractors,
                fileIds: uploadedFileIds,
                systemPrompt: options.systemPrompt,
            });
        } finally {
            if (uploadedFileIds.length) {
                await FileManager.deleteFiles(uploadedFileIds);
            }
        }
    }

    private validateStrategy(strategy: ExtractionStrategyName): ExtractionStrategyName {
        if (!STRATEGY_FACTORIES[strategy]) {
            throw new Error(`Unsupported extraction strategy: ${strategy}`);
        }
        return strategy;
    }
}
