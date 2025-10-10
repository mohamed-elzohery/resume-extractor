import { promises as fs } from 'node:fs';
import path from 'node:path';

import { createResumeExtractor, ExtractorRegistry, type ResumeFile } from './src';

const SAMPLE_RESUME_NAME = 'sample-resume.pdf';

async function loadSampleResume(): Promise<ResumeFile[]> {
    const filePath = path.join(process.cwd(), SAMPLE_RESUME_NAME);
    const data = await fs.readFile(filePath);

    return [
        {
            name: SAMPLE_RESUME_NAME,
            data,
            mimeType: 'application/pdf',
        },
    ];
}

async function runBasicExtraction() {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is required to run the extraction example.');
    }

    const client = createResumeExtractor();
    const files = await loadSampleResume();


    const result = await client.extract({
        files,
        extractors: [
            { extractor: 'contact' },
            { extractor: 'education' },
            { extractor: 'experience' },
            { extractor: 'skills' },
            { extractor: 'summary' },
            { extractor: 'projects' },
            { extractor: 'certification' },
            { extractor: 'language' },
            { extractor: 'honors' },
            { extractor: 'social_links' },
        ]
    });

    console.log('Extraction result:');
    console.dir(result, { depth: null });
}

runBasicExtraction().catch((error) => {
    console.error('Failed to run basic extraction:', error);
    process.exit(1);
});
