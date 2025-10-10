import type { BuiltInExtractorKey } from '../../src/types/extractor.types';
import type { Extractor } from '../../src/extractors/Extractor';
export declare const BUILT_IN_EXTRACTORS: BuiltInExtractorKey[];
export declare const instantiateExtractor: (reference: BuiltInExtractorKey | Extractor) => Extractor;
export declare const getSchemaForExtractor: (reference: BuiltInExtractorKey | Extractor) => import("../../src/types/core.types").AnyZodObject;
