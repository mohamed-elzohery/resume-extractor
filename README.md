# resume-extractor

`resume-extractor` turns unstructured resume content into structured JSON using the OpenAI Responses API. It ships with strongly-typed extractors for common resume sections and lets you fully customise prompts, schemas, and execution strategy.

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
import { Resume } from 'resume-extractor';
import { readFileSync } from 'node:fs';

const files = [
  {
    name: 'resume.pdf',
    data: readFileSync('resume.pdf'),
  },
];

const resume = new Resume(files);
const runner = resume.extract(['contact', 'experience']);
const result = await runner.run();

console.log(result.contact);
console.log(result.experiences); // plural output keys come from the schema
```

Each file must include a `name`, binary `data` (`Buffer`, `Uint8Array`, `ArrayBuffer`, `File`, or `ReadStream`), and an optional `mimeType` (defaults to `application/octet-stream`).

## Choosing a strategy

`BulkRunnable#run` accepts an optional strategy:

```ts
await runner.run({ strategy: 'single_llm_call' });
```

- **`parallel_calls` (default)** – each extractor issues its own LLM request for maximum accuracy.
- **`single_llm_call`** – all extractors share a single prompt and schema for lower latency/cost.

You can also set a global default using the `ResumeExtractionClient` wrapper:

```ts
import { ResumeExtractionClient } from 'resume-extractor';

const client = new ResumeExtractionClient('single_llm_call');
const result = await client.extract({
  files,
  extractors: ['contact', 'skills'],
  context: { systemPrompt: 'You are an accurate resume extractor assistant.' },
});
```

## Working with built-in extractors

Built-in extractors expose sensible prompts and Zod object schemas with pluralised keys for list data:

```ts
import { EducationExtractor } from 'resume-extractor';

const education = new EducationExtractor();
education.setPrompt('Emphasise postgraduate studies.');

const resume = new Resume(files);
const result = await resume.extract([education]).run();

console.log(result.educations);
```

All extractors share a common `Extractor` base that enforces object schemas. Update either the prompt or schema at runtime:

```ts
import { z } from 'zod';
import { Extractor } from 'resume-extractor';
import { EducationSchema } from 'resume-extractor/schemas/sections/EducationSchema';

const postgraduate = new Extractor(
  'Only return postgraduate entries.',
  z.object({ postgraduate_educations: z.array(EducationSchema) }),
);

const runner = resume.extract([postgraduate]);
const data = await runner.run();
```

## Registering custom extractors

Extend the system by registering a factory with the `ExtractorRegistry`:

```ts
import { Extractor, ExtractorRegistry } from 'resume-extractor';
import { z } from 'zod';

class GithubExtractor extends Extractor {
  constructor() {
    super(
      'Extract notable GitHub repositories with URLs.',
      z.object({ github_repositories: z.array(z.string().url()) }),
    );
  }
}

ExtractorRegistry.register('github', () => new GithubExtractor());

const resume = new Resume(files);
const result = await resume.extract(['github']).run();
```

## API overview

- `Resume` – represent one or more resume files and resolve extractors.
- `BulkRunnable` – returned from `resume.extract([...])`; call `run({ strategy?, systemPrompt? })` to execute.
- `Extractor` – base class for all extractors; ensures schemas are Zod objects with named keys.
- `ExtractorRegistry` – look up built-in and custom extractors by key.
- `ResumeExtractionClient` – optional convenience wrapper that hides `Resume` creation.

## License

MIT © Mohamed Elzohery
