import { vi } from 'vitest';

const extractWithLLMMock = vi.fn();
const uploadMock = vi.fn();
const deleteMock = vi.fn();

vi.mock('../../src/services/llm', () => ({
    extractWithLLM: extractWithLLMMock,
    getOpenAIClient: () => ({
        files: {
            create: uploadMock,
            delete: deleteMock,
        },
    }),
}));

export const resetLLMMock = () => {
    extractWithLLMMock.mockReset();
    uploadMock.mockReset();
    deleteMock.mockReset();
    deleteMock.mockImplementation(async () => { });
};

export const setLLMSequence = (
    sequence: Array<unknown | ((args: any) => unknown) | Error>
) => {
    let callIndex = 0;
    extractWithLLMMock.mockImplementation(async (args: any) => {
        if (callIndex >= sequence.length) {
            throw new Error('No mock LLM response configured for call index ' + callIndex);
        }
        const current = sequence[callIndex++];

        if (current instanceof Error) {
            throw current;
        }

        return typeof current === 'function' ? current(args) : current;
    });
};

export const setLLMHandler = (handler: (args: any, callIndex: number) => unknown) => {
    let callIndex = 0;
    extractWithLLMMock.mockImplementation(async (args: any) => handler(args, callIndex++));
};

export const getLLMMock = () => extractWithLLMMock;

export const getUploadMocks = () => ({ uploadMock, deleteMock });

export const setUploadSequence = (ids: string[]) => {
    let index = 0;
    uploadMock.mockImplementation(async () => ({ id: ids[index++] ?? `file-${index}` }));
};
