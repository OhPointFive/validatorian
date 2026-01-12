import { describe, test, expect } from "vitest";
import { UnionValidationError } from "../../src/errors/union";
import { SingleValidationError } from "../../src/errors/single";

describe("UnionValidationError", () => {
    test("should exist", () => {
        expect(UnionValidationError).toBeDefined();
    });

    test("should be a constructor", () => {
        const e1 = new SingleValidationError("string", null);
        const e2 = new SingleValidationError("number", null);
        new UnionValidationError([e1, e2], 1);
    });

    test("should not be callable", () => {
        const e1 = new SingleValidationError("string", null);
        const e2 = new SingleValidationError("number", null);
        expect(() => {
            // @ts-expect-error
            UnionValidationError([e1, e2], 1);
        }).toThrow();
    });

    test("should be an instance of ValidationError", () => {
        const e1 = new SingleValidationError("string", null);
        const e2 = new SingleValidationError("number", null);
        const error = new UnionValidationError([e1, e2], 1);
        expect(error).toBeInstanceOf(UnionValidationError);
        expect(error).toBeInstanceOf(Error);
    });

    test("should have .errors and .value", () => {
        const e1 = new SingleValidationError("string", null);
        const e2 = new SingleValidationError("number", null);
        const error = new UnionValidationError([e1, e2], 1);
        expect(error.errors).toStrictEqual([e1, e2]);
        expect(error.value).toEqual(1);
    });

    test("should have .path and .pathString()", () => {
        const symbol = Symbol("symbol");
        const e1 = new SingleValidationError("string", null);
        const e2 = new SingleValidationError("number", null);
        const error = new UnionValidationError([e1, e2], 1, ["key", 2, symbol]);
        expect(error.path).toStrictEqual(["key", 2, symbol]);
        expect(error.pathString()).toEqual(".key[2][Symbol(\"symbol\")]");
    });

    test("should have a readable message", () => {
        const e1 = new SingleValidationError("string", null);
        const e2 = new SingleValidationError("number", null);
        const error = new UnionValidationError([e1, e2], 1, ["key", 2, Symbol("symbol")]);
        expect(error.message).toEqual("Expected one of string, number at .key[2][Symbol(\"symbol\")] but got an error for every option:\n  Expected string but got null\n  Expected number but got null");
    });

    test("should have a readable message without path", () => {
        const e1 = new SingleValidationError("string", null);
        const e2 = new SingleValidationError("number", null);
        const error = new UnionValidationError([e1, e2], 1);
        expect(error.message).toEqual("Expected one of string, number but got an error for every option:\n  Expected string but got null\n  Expected number but got null");
    });

    test("should have an extended path", () => {
        const symbol = Symbol("symbol");
        const e1 = new SingleValidationError("string", null, ["key", 2, symbol]);
        const e2 = new SingleValidationError("number", null, ["key", 2, symbol]);
        const error = new UnionValidationError([e1, e2], 1, ["key", 2, symbol]);
        const extendedError = error.withExtendedPath("key2");
        expect(extendedError).toBeInstanceOf(UnionValidationError);
        expect(extendedError.errors).toStrictEqual([
            new SingleValidationError("string", null, ["key2", "key", 2, symbol]),
            new SingleValidationError("number", null, ["key2", "key", 2, symbol]),
        ]);
        expect(extendedError.path).toStrictEqual(["key2", "key", 2, symbol]);
    });

    test("should have an extended path without path", () => {
        const e1 = new SingleValidationError("string", null);
        const e2 = new SingleValidationError("number", null);
        const error = new UnionValidationError([e1, e2], 1);
        const extendedError = error.withExtendedPath("key2");
        expect(extendedError).toBeInstanceOf(UnionValidationError);
        expect(extendedError.errors).toStrictEqual([
            new SingleValidationError("string", null, ["key2"]),
            new SingleValidationError("number", null, ["key2"]),
        ]);
        expect(extendedError.path).toStrictEqual(["key2"]);
    });

    test("should have a .pathString()", () => {
        const symbol = Symbol("symbol");
        const e1 = new SingleValidationError("string", null);
        const e2 = new SingleValidationError("number", null);
        const error = new UnionValidationError([e1, e2], 1, ["key", 2, symbol]);
        expect(error.pathString()).toEqual(".key[2][Symbol(\"symbol\")]");
    });

    test("should have a .pathString() without path", () => {
        const e1 = new SingleValidationError("string", null);
        const e2 = new SingleValidationError("number", null);
        const error = new UnionValidationError([e1, e2], 1);
        expect(error.pathString()).toEqual("");
    });

    test("should format message when a sub error is another union", () => {
        const nested = new UnionValidationError(
            [
                new SingleValidationError("number", null),
                new SingleValidationError("boolean", null),
            ],
            1,
        );
        const top = new UnionValidationError(
            [
                new SingleValidationError("string", null),
                nested,
            ],
            1,
            ["key", 2, Symbol("symbol")],
        );
        expect(top.message).toEqual(
            "Expected one of multiple types at .key[2][Symbol(\"symbol\")] but got an error for every option:\n"
            + "  Expected string but got null\n"
            + "  Expected one of number, boolean but got an error for every option:\n"
            + "    Expected number but got null\n"
            + "    Expected boolean but got null",
        );
    });
});
