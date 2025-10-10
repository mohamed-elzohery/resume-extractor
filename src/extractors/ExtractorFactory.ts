import { ExtractorRegistry } from './ExtractorRegistry';
import type { Extractor } from './Extractor';

export class ExtractorFactory {
    static resolve(reference: string | Extractor): Extractor {
        return typeof reference === 'string' ? ExtractorRegistry.create(reference) : reference;
    }
}

export const resolveExtractor = ExtractorFactory.resolve.bind(ExtractorFactory);
