import { ResumeExtractionClient } from './core/DocumentProcessor';
import { ExtractorRegistry } from './extractors/ExtractorRegistry';
import { BaseExtractor } from './extractors/base/BaseExtractor';
import type { ExtractionMode } from './types/extractor.types';

export { ResumeExtractionClient, ExtractorRegistry, BaseExtractor };
export type {
    ExtractionRequest,
    ExtractionResult,
    ExtractionMode,
    ExtractorSelection,
    ExtractorOverrideOptions,
    BuiltInExtractorKey,
    SingleExtractorRequest,
    ResumeFile,
    ExtractionContext,
} from './types/extractor.types';

export const createResumeExtractor = (mode: ExtractionMode = 'parallel_calls') =>
    new ResumeExtractionClient(mode);
