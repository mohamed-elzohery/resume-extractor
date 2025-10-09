import { vi } from 'vitest';

const generateObjectMock = vi.fn();

vi.mock('ai', () => ({
    generateObject: generateObjectMock,
}));

vi.mock('@ai-sdk/openai', () => ({
    openai: vi.fn(() => ({ id: 'mock-model' })),
}));

export const resetLLMMock = () => {
    generateObjectMock.mockReset();
};

export const setLLMSequence = (
    sequence: Array<unknown | ((args: any) => unknown) | Error>
) => {
    let callIndex = 0;
    generateObjectMock.mockImplementation(async (args: any) => {
        if (callIndex >= sequence.length) {
            throw new Error('No mock LLM response configured for call index ' + callIndex);
        }
        const current = sequence[callIndex++];

        if (current instanceof Error) {
            throw current;
        }

        const value = typeof current === 'function' ? current(args) : current;
        return { object: value };
    });
};

export const setLLMHandler = (handler: (args: any, callIndex: number) => unknown) => {
    let callIndex = 0;
    generateObjectMock.mockImplementation(async (args: any) => {
        const value = handler(args, callIndex++);
        if (value instanceof Error) {
            throw value;
        }
        return { object: value };
    });
};

export const getLLMMock = () => generateObjectMock;
