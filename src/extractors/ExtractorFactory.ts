import { ExtractorRegistry } from './ExtractorRegistry';
import type { ExtractorSelection, PreparedExtractor } from '../types/extractor.types';
import { BaseExtractor } from './base/BaseExtractor';

const toCamelCase = (value: string) =>
    value
        .replace(/[_\s]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ''))
        .replace(/^(.)/, (match) => match.toLowerCase());

const inferResultKey = (extractor: BaseExtractor) => {
    const name = extractor.constructor.name.replace(/Extractor$/, '');
    return toCamelCase(name);
};

export class ExtractorFactory {
    static prepare<Selection extends ExtractorSelection>(
        selection: Selection
    ): PreparedExtractor<Selection> {
        const extractorRef = selection.extractor;
        const instance =
            typeof extractorRef === 'string'
                ? ExtractorRegistry.create(extractorRef)
                : extractorRef;

        if (!(instance instanceof BaseExtractor)) {
            throw new Error('Invalid extractor provided.');
        }

        const id =
            selection.resultKey ??
            (typeof extractorRef === 'string' ? extractorRef : inferResultKey(instance));

        return {
            id: id as PreparedExtractor<Selection>['id'],
            instance,
            selection,
            overrides: {
                prompt: selection.prompt,
                schema: selection.schema,
                outputFormat: selection.outputFormat,
            },
        };
    }
}
