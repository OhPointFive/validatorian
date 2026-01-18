import { describe, test, expect } from "vitest";
import { vBoolean } from "../../src/validators/boolean";
import { SingleValidationError } from "../../src/errors/single";

describe("vBoolean", () => {
    test("should exist", () => {
        expect(vBoolean).toBeDefined();
    });

    test("should validate booleans", () => {
        expect(vBoolean(true)).toEqual(true);
        expect(vBoolean(false)).toEqual(false);
    });

    test("should throw for non-booleans", () => {
        expect(() => vBoolean(1)).toThrow(new SingleValidationError("boolean", 1));
        expect(() => vBoolean(0)).toThrow(new SingleValidationError("boolean", 0));
        expect(() => vBoolean("true")).toThrow(new SingleValidationError("boolean", "true"));
        expect(() => vBoolean("false")).toThrow(new SingleValidationError("boolean", "false"));
        expect(() => vBoolean(null)).toThrow(new SingleValidationError("boolean", null));
        expect(() => vBoolean(undefined)).toThrow(new SingleValidationError("boolean", undefined));
        expect(() => vBoolean({})).toThrow(new SingleValidationError("boolean", {}));
        const func = () => {};
        expect(() => vBoolean(func)).toThrow(new SingleValidationError("boolean", func));
    });

    test("should pass type checking", () => {
        const b1: boolean = vBoolean(true as unknown);

        // @ts-expect-error
        const b2: number = vBoolean(true as unknown);
    });
});
