export declare const resetLLMMock: () => void;
export declare const setLLMSequence: (sequence: Array<unknown | ((args: any) => unknown) | Error>) => void;
export declare const setLLMHandler: (handler: (args: any, callIndex: number) => unknown) => void;
export declare const getLLMMock: () => import("vitest").Mock<(...args: any[]) => any>;
