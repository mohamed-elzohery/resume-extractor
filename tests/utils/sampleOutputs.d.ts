import type { BuiltInExtractorKey } from '../../src/types/extractor.types';
export declare const getSampleOutput: (key: BuiltInExtractorKey) => unknown;
export declare const getAllSampleOutputs: () => {
    key: BuiltInExtractorKey;
    value: unknown;
}[];
