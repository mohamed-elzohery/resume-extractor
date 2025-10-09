import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ResumeFile } from '../../src/types/extractor.types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SAMPLE_FILE_PATH = resolve(__dirname, '../../sample-resume.pdf');

export const loadSampleFiles = (): ResumeFile[] => [
    {
        name: 'sample-resume.pdf',
        data: readFileSync(SAMPLE_FILE_PATH),
        mimeType: 'application/pdf',
    },
];

export const createFiles = (overrides: Partial<ResumeFile>[] = []): ResumeFile[] => {
    if (!overrides.length) {
        return loadSampleFiles();
    }

    return overrides.map((override, index) => ({
        name: override.name ?? `file-${index}.pdf`,
        data: override.data ?? readFileSync(SAMPLE_FILE_PATH),
        mimeType: override.mimeType ?? 'application/pdf',
    }));
};
