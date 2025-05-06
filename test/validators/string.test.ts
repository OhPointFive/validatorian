import { describe, test, expect } from "vitest";
import { vNonEmptyString, vString, vStringOfLength } from "../../src/validators/string";
import { SingleValidationError } from "../../src/errors/single";

describe("vString", () => {
    test("should exist", () => {
        expect(vString).toBeDefined();
    });

    test("should validate strings", () => {
        expect(vString("test")).toEqual("test");
        expect(vString("")).toEqual("");
        expect(vString("According to all known laws of aviation, there is no way a bee should be able to fly.\nIts wings are too small to get its fat little body off the ground.\nThe bee of course flies anyway because bees don't care what humans think is impossible.\n")).toEqual("According to all known laws of aviation, there is no way a bee should be able to fly.\nIts wings are too small to get its fat little body off the ground.\nThe bee of course flies anyway because bees don't care what humans think is impossible.\n");
    });

    test("should throw for non-strings", () => {
        expect(() => vString(1)).toThrow(new SingleValidationError("string", 1));
        expect(() => vString(true)).toThrow(new SingleValidationError("string", true));
        expect(() => vString(null)).toThrow(new SingleValidationError("string", null));
        expect(() => vString(undefined)).toThrow(new SingleValidationError("string", undefined));
        expect(() => vString({})).toThrow(new SingleValidationError("string", {}));
        const func = () => {};
        expect(() => vString(func)).toThrow(new SingleValidationError("string", func));
    });
});

describe("vNonEmptyString", () => {
    test("should exist", () => {
        expect(vNonEmptyString).toBeDefined();
    });

    test("should validate non-empty strings", () => {
        expect(vNonEmptyString("test")).toEqual("test");
        expect(vNonEmptyString("\n\t")).toEqual("\n\t");
    });

    test("should throw for empty strings", () => {
        expect(() => vNonEmptyString("")).toThrow(new SingleValidationError("non-empty string", ""));
    });

    test("should throw for non-strings", () => {
        expect(() => vNonEmptyString(1)).toThrow(new SingleValidationError("non-empty string", 1));
        expect(() => vNonEmptyString(true)).toThrow(new SingleValidationError("non-empty string", true));
        expect(() => vNonEmptyString(null)).toThrow(new SingleValidationError("non-empty string", null));
        expect(() => vNonEmptyString(undefined)).toThrow(new SingleValidationError("non-empty string", undefined));
        expect(() => vNonEmptyString({})).toThrow(new SingleValidationError("non-empty string", {}));
        const func = () => {};
        expect(() => vNonEmptyString(func)).toThrow(new SingleValidationError("non-empty string", func));
    });
});

describe("vStringOfLength", () => {
    test("should exist", () => {
        expect(vStringOfLength).toBeDefined();
    });

    test("should validate strings of exact length", () => {
        expect(vStringOfLength(3)("123")).toEqual("123");
        expect(() => { vStringOfLength(3)("1234"); }).toThrow(new SingleValidationError("string of length 3", "1234"));
        expect(() => { vStringOfLength(3)("12"); }).toThrow(new SingleValidationError("string of length 3", "12"));
        expect(() => { vStringOfLength(3)(""); }).toThrow(new SingleValidationError("string of length 3", ""));
        expect(() => { vStringOfLength(3)("1234567890"); }).toThrow(new SingleValidationError("string of length 3", "1234567890"));
        expect(vStringOfLength(0)("")).toEqual("");
        expect(() => { vStringOfLength(0)("1"); }).toThrow(new SingleValidationError("string of length 0", "1"));
        expect(vStringOfLength(28)("antidisestablishmentarianism")).toEqual("antidisestablishmentarianism");
    });

    test("should validate strings of min and max length", () => {
        expect(vStringOfLength(3, 5)("123")).toEqual("123");
        expect(vStringOfLength(3, 5)("1234")).toEqual("1234");
        expect(vStringOfLength(3, 5)("12345")).toEqual("12345");
        expect(() => { vStringOfLength(3, 5)("12"); }).toThrow(new SingleValidationError("string of length [3, 5]", "12"));
        expect(() => { vStringOfLength(3, 5)(""); }).toThrow(new SingleValidationError("string of length [3, 5]", ""));
        expect(() => { vStringOfLength(3, 5)("1234567890"); }).toThrow(new SingleValidationError("string of length [3, 5]", "1234567890"));
        expect(vStringOfLength(0, 10)("")).toEqual("");
        expect(vStringOfLength(26, 30)("antidisestablishmentarianism")).toEqual("antidisestablishmentarianism");
    });

    test("should throw for non-strings", () => {
        expect(() => vStringOfLength(3, 5)(1)).toThrow(new SingleValidationError("string of length [3, 5]", 1));
        expect(() => vStringOfLength(3, 5)(true)).toThrow(new SingleValidationError("string of length [3, 5]", true));
        expect(() => vStringOfLength(3, 5)(null)).toThrow(new SingleValidationError("string of length [3, 5]", null));
        expect(() => vStringOfLength(3, 5)(undefined)).toThrow(new SingleValidationError("string of length [3, 5]", undefined));
        expect(() => vStringOfLength(3, 5)({})).toThrow(new SingleValidationError("string of length [3, 5]", {}));
        const func = () => {};
        expect(() => vStringOfLength(3, 5)(func)).toThrow(new SingleValidationError("string of length [3, 5]", func));
    });
});
