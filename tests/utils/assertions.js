import { expect } from 'vitest';
export const expectMatchesSchema = (value, schema, message) => {
    const result = schema.safeParse(value);
    if (!result.success) {
        throw new Error(message ?? result.error.message);
    }
    expect(result.success).toBe(true);
};
//# sourceMappingURL=assertions.js.map