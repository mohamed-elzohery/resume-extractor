import type { ReadStream } from 'node:fs';
import type { ZodObject, ZodRawShape } from 'zod';
import type { ResumeFile } from '../core/ResumeFile';
import type { BulkRunnable } from '../core/BulkRunnable';
import type { Extractor } from '../extractors';

export type ExtractionStrategyName = 'parallel_calls' | 'single_llm_call';

export interface HasFiles {
    getFiles(): ResumeFile[];
    setFiles(files: Iterable<ResumeFile>): void;
}

export interface Extractable {
    extract(resolvables: ReadonlyArray<ExtractorResolvable>): BulkRunnable;
}

export interface HasPrompt {
    getPrompt(): string;
    setPrompt(prompt: string): void;
}

export type AnyZodObject = ZodObject<ZodRawShape, any, any, any>;

export interface HasSchema<TSchema extends AnyZodObject = AnyZodObject> {
    getSchema(): TSchema;
    setSchema(schema: TSchema): void;
}

export interface Runnable<TOptions = undefined, TResult = unknown> {
    run(options?: TOptions): Promise<TResult>;
}

export interface HasStrategy<Strategy extends string = string> {
    getStrategy(): Strategy;
    setStrategy(strategy: Strategy): void;
}

export type ExtractorResolvable = string | Extractor;

export interface ExtractorRunOptions {
    fileIds: string[];
    systemPrompt?: string;
}

export interface BulkRunOptions {
    strategy?: ExtractionStrategyName;
    systemPrompt?: string;
}

export interface ExtractorConfig<TSchema extends AnyZodObject = AnyZodObject> {
    prompt: string;
    schema: TSchema;
}

export type ResumeFileLikeSource = File | ReadStream | Buffer | ArrayBuffer | Uint8Array;

export interface ResumeFileLike {
    name: string;
    data: ResumeFileLikeSource;
    mimeType?: string;
}
