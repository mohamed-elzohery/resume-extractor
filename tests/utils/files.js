import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SAMPLE_FILE_PATH = resolve(__dirname, '../../sample-resume.pdf');
export const loadSampleFiles = () => [
    {
        name: 'sample-resume.pdf',
        data: readFileSync(SAMPLE_FILE_PATH),
        mimeType: 'application/pdf',
    },
];
export const createFiles = (overrides = []) => {
    if (!overrides.length) {
        return loadSampleFiles();
    }
    return overrides.map((override, index) => ({
        name: override.name ?? `file-${index}.pdf`,
        data: override.data ?? readFileSync(SAMPLE_FILE_PATH),
        mimeType: override.mimeType ?? 'application/pdf',
    }));
};
//# sourceMappingURL=files.js.map