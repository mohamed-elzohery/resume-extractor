# resume-extractor

`resume-extractor` turns unstructured resume content into structured JSON using the Vercel AI SDK. It ships with opinionated extractors for common resume sections and lets you customize prompts, schemas, and execution strategy.

## Installation

```bash
npm install resume-extractor
```

Set your OpenAI API key before running:

```bash
export OPENAI_API_KEY=your-key
```

## Quick start

```ts
import { createResumeExtractor } from 'resume-extractor';
import { readFileSync } from 'node:fs';

const extractor = createResumeExtractor();
const file = readFileSync('resume.pdf');

const result = await extractor.extract({
  files: [{ name: 'resume.pdf', data: file }],
  extractors: [{ extractor: 'contact' }, { extractor: 'experience' }],
});

console.log(result.contact);
console.log(result.experience);
```

Each entry in `files` must include a `name`, the binary `data` (Buffer, `Uint8Array`, or base64 string), and an optional `mimeType` if you need something other than `application/pdf`.

Call `createResumeExtractor('batch_calls')` if you want to default to the single-call strategy; otherwise it defaults to `parallel_calls`.

## Running a single extractor

```ts
const experience = await extractor.extractOne({
  files: [{ name: 'resume.pdf', data: file }],
  extractor: 'experience',
});
```

> ℹ️ `extractor` can be either a built-in key (e.g., `"experience"`) or an instance of a class that extends `BaseExtractor`.

## Customizing prompt and schema

Override any extractor at call time by providing a new prompt and schema. The schema must be a Zod schema compatible with Vercel AI's `generateObject` helper.

```ts
import { z } from 'zod';

await extractor.extractOne({
  files: [{ name: 'resume.pdf', data: file }],
  extractor: 'projects',
  prompt: 'Focus only on OSS projects with GitHub links.',
  schema: z.array(
    z.object({
      name: z.string(),
      url: z.string().url().nullable(),
      summary: z.string().nullable(),
    }),
  ),
});
```

TypeScript will infer the return type from the provided schema (`z.infer<typeof schema>`), so `data` is strongly typed whether you use the built-in schema or supply your own.

You can apply the same overrides when you run multiple extractors. Use `resultKey` to rename the entry in the aggregated output.

```ts
const data = await extractor.extract({
  files: [{ name: 'resume.pdf', data: file }],
  extractors: [
    {
      extractor: 'experience',
      prompt: 'Return only remote roles.',
      resultKey: 'remoteExperience',
    },
  ],
});
```

## Execution modes

The library supports two execution strategies:

1. **`parallel_calls` (default)** – Each extractor issues its own LLM request. This maximizes accuracy but can be more expensive.
2. **`batch_calls`** – All extractors are merged into a single LLM request. This is cost-effective for large batches.

```ts
// Run everything in a single request
const batchClient = createResumeExtractor('batch_calls');

const data = await batchClient.extract({
  files: [{ name: 'resume.pdf', data: file }],
  extractors: [
    { extractor: 'contact' },
    { extractor: 'skills', resultKey: 'skillset' },
  ],
  context: {
    systemPrompt: 'You are an accurate resume extractor assistant.',
  },
});
```

## Custom extractors

Register your own extractor by extending `BaseExtractor` and adding it to the registry.

```ts
import { BaseExtractor, ExtractorRegistry } from 'resume-extractor';

class GithubExtractor extends BaseExtractor {
  getSchema() {
    /* ... */
  }
  getPromptTemplate() {
    /* ... */
  }
  getOutputFormat() {
    return 'object' as const;
  }
}

ExtractorRegistry.register('github', () => new GithubExtractor());

await extractor.extract({
  files: [{ name: 'resume.pdf', data: file }],
  extractors: [{ extractor: 'github' }],
});
```

## License

MIT © Mohamed Elzohery
