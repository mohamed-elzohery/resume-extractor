import type { ResumeFileLike } from '../../src/types/extractor.types';
export declare const loadSampleFiles: () => ResumeFileLike[];
export declare const createFiles: (overrides?: Partial<ResumeFileLike>[]) => ResumeFileLike[];
