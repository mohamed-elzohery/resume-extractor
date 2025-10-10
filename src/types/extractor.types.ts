import type { ZodSchema } from 'zod/v3';
import type { BaseExtractor } from '../extractors/base/BaseExtractor';
import type { Uploadable, ToFileInput } from 'openai/uploads';

export type BuiltInExtractorKey =
    | 'contact'
    | 'experience'
    | 'education'
    | 'skills'
    | 'projects'
    | 'certification'
    | 'language'
    | 'summary'
    | 'honors'
    | 'social_links';

export type ExtractionMode = 'parallel_calls' | 'batch_calls';

export type ResumeFileData = Uploadable | ToFileInput | Promise<Uploadable | ToFileInput>;

export interface ResumeFile {
    name: string;
    data: ResumeFileData;
    mimeType?: string;
}

export interface ExtractorOverrideOptions<Schema extends ZodSchema | undefined = undefined> {
    /** Provide a custom prompt to override the built-in extractor prompt. */
    prompt?: string;
    /** Provide a custom schema to validate the extractor output. */
    schema?: Schema;
    /** Optional output format override. */
    outputFormat?: 'array' | 'object';
}

export type ExtractorReference = BuiltInExtractorKey | BaseExtractor | (string & {});

export interface ExtractorSelection<
    Schema extends ZodSchema | undefined = undefined,
    Key extends string | undefined = undefined
> extends ExtractorOverrideOptions<Schema> {
    /** Built-in extractor key or a custom extractor instance. */
    extractor: ExtractorReference;
    /** Optional override for the result key in the aggregated output. */
    resultKey?: Key;
}

export interface ExtractionContext {
    systemPrompt?: string;
}

export interface ExtractionRequest<Selections extends readonly ExtractorSelection[] = ExtractorSelection[]> {
    files: ResumeFile[];
    extractors: Selections;
    context?: ExtractionContext;
}

export interface SingleExtractorRequest<Selection extends ExtractorSelection = ExtractorSelection>
    extends ExtractorOverrideOptions<SelectionSchema<Selection>> {
    files: ResumeFile[];
    extractor: Selection['extractor'];
    context?: ExtractionContext;
}

export type SelectionSchema<S extends ExtractorSelection> = S extends ExtractorSelection<infer Schema>
    ? Schema
    : undefined;
export type SelectionResultKey<S extends ExtractorSelection> = S extends ExtractorSelection<any, infer Key>
    ? (Key extends string ? Key : string)
    : string;
export type SelectionOutput<S extends ExtractorSelection> = SelectionSchema<S> extends ZodSchema
    ? SelectionSchema<S>['_output']
    : unknown;

type SelectionResultRecord<S extends ExtractorSelection> = Record<SelectionResultKey<S>, SelectionOutput<S>>;

type UnionToIntersection<U> = (U extends any ? (arg: U) => void : never) extends (arg: infer I) => void ? I : never;
type Simplify<T> = { [K in keyof T]: T[K] };

export type ExtractionResult<Selections extends readonly ExtractorSelection[]> = Simplify<
    UnionToIntersection<SelectionResultRecord<Selections[number]>> & Record<string, unknown>
>;

export interface PreparedExtractor<Selection extends ExtractorSelection = ExtractorSelection> {
    id: SelectionResultKey<Selection>;
    instance: BaseExtractor;
    selection: Selection;
    overrides: ExtractorOverrideOptions<SelectionSchema<Selection>>;
}
