import type { Extractor } from '../extractors/Extractor';
import { ExtractorRegistry } from '../extractors/ExtractorRegistry';
import type { ExtractorResolvable, Extractable, HasFiles } from '../types/core.types';
import { BulkRunnable } from './BulkRunnable';
import { ResumeFile, type ResumeFileInit } from './ResumeFile';

export type ResumeConstructorInput = ReadonlyArray<ResumeFile | ResumeFileInit>;

export class Resume implements HasFiles, Extractable {
    private files: ResumeFile[] = [];

    constructor(files: ResumeConstructorInput) {
        this.setFiles(files);
    }

    getFiles(): ResumeFile[] {
        return this.files;
    }

    setFiles(files: Iterable<ResumeFile | ResumeFileInit>): void {
        this.files = Array.from(files, (file) => this.toResumeFile(file));

        if (!this.files.length) {
            throw new Error('Resume must be initialised with at least one file.');
        }
    }

    extract(resolvables: ReadonlyArray<ExtractorResolvable>): BulkRunnable {
        const extractors = resolvables.map((resolvable) => this.resolveExtractor(resolvable));
        return new BulkRunnable(this.files, extractors);
    }

    private resolveExtractor(resolvable: ExtractorResolvable): Extractor {
        if (typeof resolvable === 'string') {
            return ExtractorRegistry.create(resolvable);
        }

        return resolvable;
    }

    private toResumeFile(file: ResumeFile | ResumeFileInit): ResumeFile {
        if (file instanceof ResumeFile) {
            return file;
        }

        return new ResumeFile(file);
    }
}
