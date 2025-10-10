import { promises as fs } from 'node:fs';
import path from 'node:path';

import { z } from 'zod';
import {
    Resume,
    EducationExtractor,
    Extractor,
    type ResumeFileLike,
    SocialLinksExtractor,
} from './src';
import { EducationSchema } from './src/schemas/sections/EducationSchema';

const SAMPLE_RESUME_NAME = 'sample-resume.pdf';

async function loadSampleResume(): Promise<ResumeFileLike[]> {
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

    const files = await loadSampleResume();
    const resume = new Resume(files);

    // const educationExtractor = new EducationExtractor();
    // educationExtractor.setPrompt('Highlight the most recent academic achievements.');

    // const postgraduateEducationExtractor = new Extractor(
    //     'Extract only postgraduate education entries with institution, degree, and year.',
    //     z.object({ postgraduate_educations: z.array(EducationSchema) })
    // );

    // const customExtractor = new Extractor(
    //     'Extract any additional notes or miscellaneous sections that may be relevant.',
    //     z.object({ additional_notes: z.array(z.string()) })
    // );

    // const runner = resume.extract([
    //     'experience',
    //     educationExtractor,
    //     postgraduateEducationExtractor,
    //     customExtractor,
    // ]);
    // const result = await runner.run({ strategy: 'single_llm_call' });
    const educationExtractor = new EducationExtractor();
    const socialLinksExtractor = new SocialLinksExtractor();
    const result = await resume.extract([educationExtractor, socialLinksExtractor]).run({ strategy: 'single_llm_call' });
    console.log('Extraction result:');
    console.dir(result, { depth: null });
}

runBasicExtraction().catch((error) => {
    console.error('Failed to run basic extraction:', error);
    process.exit(1);
});
