import { describe, test, expect } from "vitest";
import { SingleValidationError } from "../../src/errors/single";
import { vConst, vFalse, vNull, vTrue, vUndefined } from "../../src/validators/const";

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
        expect(() => vConst(undefined)(1)).toThrow(new SingleValidationError("undefined", 1));
        expect(() => vConst(null)(1)).toThrow(new SingleValidationError("null", 1));
        expect(() => vConst(true)(1)).toThrow(new SingleValidationError("exact boolean `true`", 1));
        const symbol = Symbol("test");
        expect(() => vConst(symbol)(1)).toThrow(new SingleValidationError("exact symbol `Symbol(test)`", 1));
        expect(() => vConst("test")(symbol)).toThrow(new SingleValidationError("exact string `test`", symbol));
    });

    test("should throw error for incorrect values", () => {
        expect(() => vConst("test")("test2")).toThrow(new SingleValidationError("exact string `test`", "test2"));
        expect(() => vConst(1)(2)).toThrow(new SingleValidationError("exact number `1`", 2));
        expect(() => vConst(undefined)(null)).toThrow(new SingleValidationError("undefined", null));
        expect(() => vConst(null)(undefined)).toThrow(new SingleValidationError("null", undefined));
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

    test("should pass type checking", () => {
        const s1: "test" = vConst("test")("test");
        const s2: string = vConst("test")("test");
        const s3: "test" | "test2" = vConst("test")("test");

        // @ts-expect-error
        const s4: "test2" = vConst("test")("test");

        // @ts-expect-error
        const s5: number = vConst("test")("test");

        const s6: number = vConst(7)(7);
    });
});

describe("vNull", () => {
    test("should exist", () => {
        expect(vNull).toBeDefined();
    });

    test("should validate null", () => {
        expect(vNull(null)).toEqual(null);
    });

    test("should fail to validate non-null", () => {
        expect(() => vNull(1)).toThrow(new SingleValidationError("null", 1));
        expect(() => vNull("test")).toThrow(new SingleValidationError("null", "test"));
        expect(() => vNull(undefined)).toThrow(new SingleValidationError("null", undefined));
        expect(() => vNull(true)).toThrow(new SingleValidationError("null", true));
        expect(() => vNull(false)).toThrow(new SingleValidationError("null", false));
        expect(() => vNull(NaN)).toThrow(new SingleValidationError("null", NaN));
    });

    test("should pass type checking", () => {
        const n1: null = vNull(null);
        const n2: null | undefined = vNull(null);

        // @ts-expect-error
        const n3: undefined = vNull(null);

        // @ts-expect-error
        const n4: number = vNull(null);
    });

    // @ts-expect-error
    const n5: number = vNull(null);
});

describe("vUndefined", () => {
    test("should exist", () => {
        expect(vUndefined).toBeDefined();
    });

    test("should validate undefined", () => {
        expect(vUndefined(undefined)).toEqual(undefined);
    });

    test("should fail to validate non-undefined", () => {
        expect(() => vUndefined(1)).toThrow(new SingleValidationError("undefined", 1));
        expect(() => vUndefined("test")).toThrow(new SingleValidationError("undefined", "test"));
        expect(() => vUndefined(null)).toThrow(new SingleValidationError("undefined", null));
        expect(() => vUndefined(true)).toThrow(new SingleValidationError("undefined", true));
        expect(() => vUndefined(false)).toThrow(new SingleValidationError("undefined", false));
        expect(() => vUndefined(NaN)).toThrow(new SingleValidationError("undefined", NaN));
    });

    test("should pass type checking", () => {
        const u1: undefined = vUndefined(undefined);
        const u2: undefined | null = vUndefined(undefined);

        // @ts-expect-error
        const u3: null = vUndefined(undefined);

        // @ts-expect-error
        const u4: number = vUndefined(undefined);
    });
});

describe("vTrue", () => {
    test("should exist", () => {
        expect(vTrue).toBeDefined();
    });

    test("should validate true", () => {
        expect(vTrue(true)).toEqual(true);
    });

    test("should fail to validate non-true", () => {
        expect(() => vTrue(1)).toThrow(new SingleValidationError("exact boolean `true`", 1));
        expect(() => vTrue("test")).toThrow(new SingleValidationError("exact boolean `true`", "test"));
        expect(() => vTrue(undefined)).toThrow(new SingleValidationError("exact boolean `true`", undefined));
        expect(() => vTrue(null)).toThrow(new SingleValidationError("exact boolean `true`", null));
        expect(() => vTrue(false)).toThrow(new SingleValidationError("exact boolean `true`", false));
        expect(() => vTrue(NaN)).toThrow(new SingleValidationError("exact boolean `true`", NaN));
    });

    test("should pass type checking", () => {
        const t1: true = vTrue(true);
        const t2: boolean = vTrue(true);

        // @ts-expect-error
        const t3: false = vTrue(true);
    });
});

describe("vFalse", () => {
    test("should exist", () => {
        expect(vFalse).toBeDefined();
    });

    test("should validate false", () => {
        expect(vFalse(false)).toEqual(false);
    });

    test("should fail to validate non-false", () => {
        expect(() => vFalse(1)).toThrow(new SingleValidationError("exact boolean `false`", 1));
        expect(() => vFalse("test")).toThrow(new SingleValidationError("exact boolean `false`", "test"));
        expect(() => vFalse(undefined)).toThrow(new SingleValidationError("exact boolean `false`", undefined));
        expect(() => vFalse(null)).toThrow(new SingleValidationError("exact boolean `false`", null));
        expect(() => vFalse(true)).toThrow(new SingleValidationError("exact boolean `false`", true));
        expect(() => vFalse(NaN)).toThrow(new SingleValidationError("exact boolean `false`", NaN));
    });

    test("should pass type checking", () => {
        const f1: false = vFalse(false);
        const f2: boolean = vFalse(false);

        // @ts-expect-error
        const f3: true = vFalse(false);
    });
});
