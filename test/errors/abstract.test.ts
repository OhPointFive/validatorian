import { describe, test, expect } from "vitest";
import { PathArray, pathArrayToString, ValidationError } from "../../src/errors/abstract";

describe("ValidationError", () => {
    test("should exist", () => {
        expect(ValidationError).toBeDefined();
    });

    test("should be a class", () => {
        expect(typeof ValidationError).toBe("function");
    });

    test("should be an instance of Error", () => {
        expect(Error.prototype.isPrototypeOf(ValidationError.prototype)).toBeTruthy();
    });

    test("should not be callable", () => {
        expect(() => {
            // @ts-expect-error
            ValidationError("test");
        }).toThrow();
    });
});

describe("PathArray", () => {
    test("accepts strings, numbers, and symbols", () => {
        const symbol = Symbol("symbol");
        const path: PathArray = ["key", 1, symbol];
        expect(path).toStrictEqual(["key", 1, symbol]);
    });
});

describe("pathArrayToString", () => {
    test("should convert a simple string array to a string", () => {
        expect(pathArrayToString(["key", "key2"])).toBe(".key.key2");
    });

    test("should convert a strange string array to a string", () => {
        expect(pathArrayToString(["\n", "\t", "\r", "\\", "\""]))
            .toBe("[\"\\n\"][\"\\t\"][\"\\r\"][\"\\\\\"][\"\\\"\"]");
    });

    test("should convert a number array to a string", () => {
        expect(pathArrayToString([1, 2, 3])).toBe("[1][2][3]");
    });

    test("should convert a symbol array to a string", () => {
        expect(pathArrayToString([Symbol("a"), Symbol(2), Symbol("c")])).toBe("[Symbol(\"a\")][Symbol(\"2\")][Symbol(\"c\")]");
    });

    test("should convert strange symbols to a string", () => {
        expect(pathArrayToString(
            [Symbol("\n"), Symbol("\t"), Symbol("\r"), Symbol("\\"), Symbol("\"")]
        ))
            .toBe("[Symbol(\"\\n\")][Symbol(\"\\t\")][Symbol(\"\\r\")][Symbol(\"\\\\\")][Symbol(\"\\\"\")]");
    });

    test("should handle undescribed symbols", () => {
        expect(pathArrayToString([Symbol()])).toBe("[Symbol()]");
    });

    test("should handle a mixed array", () => {
        expect(pathArrayToString([1, "a", Symbol("description")])).toBe("[1].a[Symbol(\"description\")]");
    });
});
