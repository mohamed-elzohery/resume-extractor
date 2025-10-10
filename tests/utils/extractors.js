import { ExtractorRegistry } from '../../src/extractors/ExtractorRegistry';
export const BUILT_IN_EXTRACTORS = ExtractorRegistry.list();
export const instantiateExtractor = (reference) => typeof reference === 'string' ? ExtractorRegistry.create(reference) : reference;
export const getSchemaForExtractor = (reference) => instantiateExtractor(reference).getSchema();
//# sourceMappingURL=extractors.js.map