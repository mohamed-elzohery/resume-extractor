import type { ResumeFile } from '../../src/types/extractor.types';
export declare const loadSampleFiles: () => ResumeFile[];
export declare const createFiles: (overrides?: Partial<ResumeFile>[]) => ResumeFile[];
