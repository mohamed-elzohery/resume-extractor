import { expect } from 'vitest';
export const expectMatchesSchema = (value: unknown, schema: any, message?: string) => {
    const result = schema.safeParse(value);
    if (!result.success) {
        throw new Error(message ?? result.error.message);
    }
    expect(result.success).toBe(true);
};
