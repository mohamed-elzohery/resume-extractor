import { Resume } from './Resume';
import type { BulkRunnable } from './BulkRunnable';
import type {
    BulkRunOptions,
    ExtractorResolvable,
    ExtractionStrategyName,
    ResumeFileLike,
} from '../types/core.types';

const DEFAULT_SYSTEM_PROMPT = 'You are an accurate resume extractor assistant.';

export interface ExtractionRequest {
    files: ResumeFileLike[];
    extractors: ReadonlyArray<ExtractorResolvable>;
    context?: {
        systemPrompt?: string;
        strategy?: ExtractionStrategyName;
    };
}

export class ResumeExtractionClient {
    private strategy: ExtractionStrategyName;

    constructor(strategy: ExtractionStrategyName = 'parallel_calls') {
        this.strategy = strategy;
    }

    setStrategy(strategy: ExtractionStrategyName) {
        this.strategy = strategy;
    }

    private createRunner(files: ResumeFileLike[], extractors: ReadonlyArray<ExtractorResolvable>): BulkRunnable {
        const resume = new Resume(files);
        const runner = resume.extract(extractors);
        runner.setStrategy(this.strategy);
        return runner;
    }

    async extract(request: ExtractionRequest) {
        const { files, extractors, context } = request;
        const runner = this.createRunner(files, extractors);
        if (context?.strategy) {
            runner.setStrategy(context.strategy);
        }

        const options: BulkRunOptions = {
            strategy: context?.strategy ?? this.strategy,
            systemPrompt: context?.systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
        };

        return runner.run(options);
    }
}
