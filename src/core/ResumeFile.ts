import type { ReadStream } from 'node:fs';
import { Buffer } from 'node:buffer';
import { toFile } from 'openai/uploads';
import type { Uploadable } from 'openai/uploads';

export type ResumeFileSource = File | ReadStream | Buffer | ArrayBuffer | Uint8Array;

export interface ResumeFileInit {
    name: string;
    data: ResumeFileSource;
    mimeType?: string;
}

const DEFAULT_MIME_TYPE = 'application/octet-stream';

const isArrayBuffer = (value: unknown): value is ArrayBuffer => value instanceof ArrayBuffer;

export class ResumeFile {
    private readonly name: string;
    private readonly mimeType: string;
    private readonly data: ResumeFileSource;
    private uploadPromise?: Promise<Uploadable>;

    constructor({ name, data, mimeType }: ResumeFileInit) {
        this.name = name;
        this.data = data;
        this.mimeType = mimeType ?? DEFAULT_MIME_TYPE;
    }

    getName(): string {
        return this.name;
    }

    getMimeType(): string {
        return this.mimeType;
    }

    getSource(): ResumeFileSource {
        return this.data;
    }

    async upload(): Promise<Uploadable> {
        if (!this.uploadPromise) {
            const prepared = this.prepareUploadable();
            this.uploadPromise = Promise.resolve(
                toFile(prepared, this.name, { type: this.mimeType })
            );
        }

        return this.uploadPromise;
    }

    private prepareUploadable(): Uploadable {
        if (isArrayBuffer(this.data)) {
            return Buffer.from(this.data) as unknown as Uploadable;
        }

        if (this.data instanceof Uint8Array) {
            return Buffer.from(this.data) as unknown as Uploadable;
        }

        return this.data as Uploadable;
    }
}
