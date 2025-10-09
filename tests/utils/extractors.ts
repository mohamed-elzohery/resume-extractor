import { ExtractorRegistry } from '../../src/extractors/ExtractorRegistry';
import type { BuiltInExtractorKey } from '../../src/types/extractor.types';
import type { BaseExtractor } from '../../src/extractors/base/BaseExtractor';

export const BUILT_IN_EXTRACTORS = ExtractorRegistry.list() as BuiltInExtractorKey[];

export const instantiateExtractor = (reference: BuiltInExtractorKey | BaseExtractor): BaseExtractor =>
    typeof reference === 'string' ? ExtractorRegistry.create(reference) : reference;

export const getSchemaForExtractor = (reference: BuiltInExtractorKey | BaseExtractor) =>
    instantiateExtractor(reference).getSchema();
