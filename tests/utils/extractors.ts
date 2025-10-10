import { ExtractorRegistry } from '../../src/extractors/ExtractorRegistry';
import type { BuiltInExtractorKey } from '../../src/types/extractor.types';
import type { Extractor } from '../../src/extractors/Extractor';

export const BUILT_IN_EXTRACTORS = ExtractorRegistry.list() as BuiltInExtractorKey[];

export const instantiateExtractor = (reference: BuiltInExtractorKey | Extractor): Extractor =>
    typeof reference === 'string' ? ExtractorRegistry.create(reference) : reference;

export const getSchemaForExtractor = (reference: BuiltInExtractorKey | Extractor) =>
    instantiateExtractor(reference).getSchema();
