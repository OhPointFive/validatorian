import { describe, test, expect } from "vitest";
import { SingleValidationError } from "../../src/errors/single";
import { vConst } from "../../src/validators/const";

describe("vConst", () => {
    test("should exist", () => {
        expect(vConst).toBeDefined();
    });

    test("should validate constants", () => {
        expect(vConst("test")("test")).toEqual("test");
        expect(vConst(1)(1)).toEqual(1);
        expect(vConst(undefined)(undefined)).toEqual(undefined);
        expect(vConst(null)(null)).toEqual(null);
        expect(vConst(true)(true)).toEqual(true);
        expect(vConst(false)(false)).toEqual(false);
        const symbol = Symbol("test");
        expect(vConst(symbol)(symbol)).toEqual(symbol);
    });

    test("should validate NaN", () => {
        expect(vConst(NaN)(NaN)).toEqual(NaN);
        expect(() => vConst(NaN)(1)).toThrow(new SingleValidationError("exact number `NaN`", 1));
        expect(() => vConst(1)(NaN)).toThrow(new SingleValidationError("exact number `1`", NaN));
    });

    test("should throw error for incorrect types", () => {
        expect(() => vConst("test")(1)).toThrow(new SingleValidationError("exact string `test`", 1));
        expect(() => vConst(1)("test")).toThrow(new SingleValidationError("exact number `1`", "test"));
        // These are weird error messages, but we provide `vNull` and so forth with better ones.
        expect(() => vConst(undefined)(1)).toThrow(new SingleValidationError("exact undefined `undefined`", 1));
        expect(() => vConst(null)(1)).toThrow(new SingleValidationError("exact object `null`", 1));
        expect(() => vConst(true)(1)).toThrow(new SingleValidationError("exact boolean `true`", 1));
        const symbol = Symbol("test");
        expect(() => vConst(symbol)(1)).toThrow(new SingleValidationError("exact symbol `Symbol(test)`", 1));
        expect(() => vConst("test")(symbol)).toThrow(new SingleValidationError("exact string `test`", symbol));
    });

    test("should throw error for incorrect values", () => {
        expect(() => vConst("test")("test2")).toThrow(new SingleValidationError("exact string `test`", "test2"));
        expect(() => vConst(1)(2)).toThrow(new SingleValidationError("exact number `1`", 2));
        expect(() => vConst(undefined)(null)).toThrow(new SingleValidationError("exact undefined `undefined`", null));
        expect(() => vConst(null)(undefined)).toThrow(new SingleValidationError("exact object `null`", undefined));
        expect(() => vConst(true)(9)).toThrow(new SingleValidationError("exact boolean `true`", 9));
        const symbol = Symbol("test");
        const symbol2 = Symbol("test2");
        expect(() => vConst(symbol)(symbol2)).toThrow(new SingleValidationError("exact symbol `Symbol(test)`", symbol2));
    });

    test("should work with non-constant values", () => {
        // This isn't what the validator is intended for,
        // but people might use it this way and it should still work.
        const number = Math.random();
        expect(vConst(number)(number)).toEqual(number);
        expect(() => vConst(number)(2)).toThrow(new SingleValidationError(`exact number \`${number}\``, 2));
        expect(() => vConst(2)(number)).toThrow(new SingleValidationError("exact number `2`", number));
        const string = Math.random().toString();
        expect(vConst(string)(string)).toEqual(string);
        expect(() => vConst(string)("2")).toThrow(new SingleValidationError(`exact string \`${string}\``, "2"));
        expect(() => vConst("2")(string)).toThrow(new SingleValidationError("exact string `2`", string));
    });
});
