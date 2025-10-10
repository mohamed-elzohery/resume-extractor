import { getOpenAIClient } from '../services/llm';
import type { ResumeFile } from './ResumeFile';

export class FileManager {
    static async uploadFiles(files: ResumeFile[]): Promise<string[]> {
        if (!files.length) {
            throw new Error('No files provided for upload.');
        }

        const client = getOpenAIClient();

        const uploads = await Promise.all(
            files.map(async (file) => {
                const prepared = await file.upload();
                const created = await client.files.create({
                    file: prepared,
                    purpose: 'user_data',
                });
                return created.id;
            })
        );

        return uploads;
    }

    static async deleteFiles(ids: string[]): Promise<void> {
        if (!ids.length) {
            return;
        }

        const client = getOpenAIClient();

        await Promise.allSettled(
            ids.map(async (id) => {
                try {
                    await client.files.delete(id);
                } catch (error) {
                    console.warn(`Failed to delete uploaded file ${id}:`, error);
                }
            })
        );
    }
}
