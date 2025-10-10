import type { BuiltInExtractorKey } from '../../src/types/extractor.types';
import type { BaseExtractor } from '../../src/extractors/base/BaseExtractor';
export declare const BUILT_IN_EXTRACTORS: BuiltInExtractorKey[];
export declare const instantiateExtractor: (reference: BuiltInExtractorKey | BaseExtractor) => BaseExtractor;
export declare const getSchemaForExtractor: (reference: BuiltInExtractorKey | BaseExtractor) => import("zod/v3").ZodType<any, import("zod/v3").ZodTypeDef, any>;
