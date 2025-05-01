import { describe, test, expect } from "vitest";
import { SingleValidationError } from "../../src/errors/single";

describe("SingleValidationError", () => {
    test("should exist", () => {
        expect(SingleValidationError).toBeDefined();
    });

    test("should be a constructor", () => {
        new SingleValidationError("string", 1);
    });

    test("should not be callable", () => {
        expect(() => {
            // @ts-expect-error
            SingleValidationError("string", 1);
        }).toThrow();
    });

    test("should be an instance of ValidationError", () => {
        const error = new SingleValidationError("string", 1);
        expect(error).toBeInstanceOf(SingleValidationError);
        expect(error).toBeInstanceOf(Error);
    });

    test("should have .expectedType and .actualValue", () => {
        const error = new SingleValidationError("string", 1);
        expect(error.expectedType).toBe("string");
        expect(error.actualValue).toBe(1);
    });

    test("should have .path and .pathString()", () => {
        const symbol = Symbol("symbol");
        const error = new SingleValidationError("string", 1, ["key", 2, symbol]);
        expect(error.path).toStrictEqual(["key", 2, symbol]);
        expect(error.pathString()).toBe(".key[2][Symbol(\"symbol\")]");
    });

    test("should have a readable message", () => {
        const error = new SingleValidationError("string", 1, ["key", 2, Symbol("symbol")]);
        expect(error.message).toBe("Expected string but got 1 at .key[2][Symbol(\"symbol\")]");
    });

    test("should have a readable message without path", () => {
        const error = new SingleValidationError("string", 1);
        expect(error.message).toBe("Expected string but got 1");
    });

    test("should have an extended path", () => {
        const symbol = Symbol("symbol");
        const error = new SingleValidationError("string", 1, ["key", 2, symbol]);
        const extendedError = error.withExtendedPath("key2");
        expect(extendedError).toBeInstanceOf(SingleValidationError);
        expect(extendedError).toEqual(new SingleValidationError("string", 1, ["key2", "key", 2, symbol]));
    });

    test("should have an extended path without path", () => {
        const error = new SingleValidationError("string", 1);
        const extendedError = error.withExtendedPath("key2");
        expect(extendedError).toBeInstanceOf(SingleValidationError);
        expect(extendedError).toEqual(new SingleValidationError("string", 1, ["key2"]));
    });

    test("should have a .pathString()", () => {
        const symbol = Symbol("symbol");
        const error = new SingleValidationError("string", 1, ["key", 2, symbol]);
        expect(error.pathString()).toBe(".key[2][Symbol(\"symbol\")]");
    });

    test("should have a .pathString() without path", () => {
        const error = new SingleValidationError("string", 1);
        expect(error.pathString()).toBe("");
    });
});
