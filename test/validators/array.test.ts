import { describe, test, expect } from "vitest";
import { SingleValidationError } from "../../src/errors/single";
import { vArray, vArrayOfLength, vArrayOfLengthBetween, vArrayOfAtLeastLength, vArrayOfAtMostLength, vNonemptyArrayOf } from "../../src/validators/array";
import { vNumber } from "../../src/validators/number";
import { vString } from "../../src/validators/string";
import type { Validator } from "../../src/validator-helpers/validator";

describe("vArray", () => {
    test("should exist", () => {
        expect(vArray).toBeDefined();
    });

    test("should validate arrays with correct items", () => {
        expect(vArray(vNumber)([1, 2, 3])).toEqual([1, 2, 3]);
        expect(vArray(vString)(["a", "b", "c"])).toEqual(["a", "b", "c"]);
        expect(vArray(vNumber)([])).toEqual([]);
    });

    test("should throw for non-arrays", () => {
        expect(() => vArray(vNumber)(1)).toThrow(new SingleValidationError("array", 1));
        expect(() => vArray(vNumber)("test")).toThrow(new SingleValidationError("array", "test"));
        expect(() => vArray(vNumber)(null)).toThrow(new SingleValidationError("array", null));
        expect(() => vArray(vNumber)(undefined)).toThrow(new SingleValidationError("array", undefined));
        expect(() => vArray(vNumber)({})).toThrow(new SingleValidationError("array", {}));
    });

    test("should throw for arrays with invalid items", () => {
        expect(() => vArray(vNumber)([1, 2, "3"])).toThrow(new SingleValidationError("number", "3"));
        expect(() => vArray(vString)(["a", "b", 3])).toThrow(new SingleValidationError("string", 3));
    });

    test("should pass type checking", () => {
        const v1: Validator<number[]> = vArray(vNumber);
        const result1: number[] = vArray(vNumber)([1, 2, 3] as unknown);

        // @ts-expect-error
        const result2: number = vArray(vNumber)([1, 2, 3] as unknown);
    });
});

describe("vArrayOfLength", () => {
    test("should exist", () => {
        expect(vArrayOfLength).toBeDefined();
    });

    test("should validate arrays of exact length", () => {
        expect(vArrayOfLength(vNumber, 3)([1, 2, 3])).toEqual([1, 2, 3]);
        expect(vArrayOfLength(vString, 2)(["a", "b"])).toEqual(["a", "b"]);
        expect(vArrayOfLength(vNumber, 0)([])).toEqual([]);
    });

    test("should throw for arrays of wrong length", () => {
        expect(() => vArrayOfLength(vNumber, 3)([1, 2])).toThrow(new SingleValidationError("array of length 3", [1, 2]));
        expect(() => vArrayOfLength(vNumber, 3)([1, 2, 3, 4])).toThrow(new SingleValidationError("array of length 3", [1, 2, 3, 4]));
        expect(() => vArrayOfLength(vString, 0)(["a"])).toThrow(new SingleValidationError("array of length 0", ["a"]));
    });

    test("should throw for non-arrays", () => {
        expect(() => vArrayOfLength(vNumber, 3)(1)).toThrow(new SingleValidationError("array of length 3", 1));
        expect(() => vArrayOfLength(vNumber, 3)("test")).toThrow(new SingleValidationError("array of length 3", "test"));
        expect(() => vArrayOfLength(vNumber, 3)(null)).toThrow(new SingleValidationError("array of length 3", null));
        expect(() => vArrayOfLength(vNumber, 3)(undefined)).toThrow(new SingleValidationError("array of length 3", undefined));
        expect(() => vArrayOfLength(vNumber, 3)({})).toThrow(new SingleValidationError("array of length 3", {}));
    });

    test("should throw for arrays with invalid items", () => {
        expect(() => vArrayOfLength(vNumber, 3)([1, 2, "3"])).toThrow(new SingleValidationError("number", "3"));
    });

    test("should pass type checking", () => {
        const v1: Validator<number[]> = vArrayOfLength(vNumber, 3);
        const result1: number[] = vArrayOfLength(vNumber, 3)([1, 2, 3] as unknown);

        // @ts-expect-error
        const result2: number = vArrayOfLength(vNumber, 3)([1, 2, 3] as unknown);
    });
});

describe("vArrayOfLengthBetween", () => {
    test("should exist", () => {
        expect(vArrayOfLengthBetween).toBeDefined();
    });

    test("should validate arrays within length range", () => {
        expect(vArrayOfLengthBetween(vNumber, 2, 4)([1, 2])).toEqual([1, 2]);
        expect(vArrayOfLengthBetween(vNumber, 2, 4)([1, 2, 3])).toEqual([1, 2, 3]);
        expect(vArrayOfLengthBetween(vNumber, 2, 4)([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
        expect(vArrayOfLengthBetween(vString, 0, 2)([])).toEqual([]);
    });

    test("should throw for arrays outside length range", () => {
        expect(() => vArrayOfLengthBetween(vNumber, 2, 4)([1])).toThrow(new SingleValidationError("array of length [2, 4]", [1]));
        expect(() => vArrayOfLengthBetween(vNumber, 2, 4)([1, 2, 3, 4, 5])).toThrow(new SingleValidationError("array of length [2, 4]", [1, 2, 3, 4, 5]));
    });

    test("should throw for non-arrays", () => {
        expect(() => vArrayOfLengthBetween(vNumber, 2, 4)(1)).toThrow(new SingleValidationError("array of length [2, 4]", 1));
        expect(() => vArrayOfLengthBetween(vNumber, 2, 4)("test")).toThrow(new SingleValidationError("array of length [2, 4]", "test"));
        expect(() => vArrayOfLengthBetween(vNumber, 2, 4)(null)).toThrow(new SingleValidationError("array of length [2, 4]", null));
        expect(() => vArrayOfLengthBetween(vNumber, 2, 4)(undefined)).toThrow(new SingleValidationError("array of length [2, 4]", undefined));
        expect(() => vArrayOfLengthBetween(vNumber, 2, 4)({})).toThrow(new SingleValidationError("array of length [2, 4]", {}));
    });

    test("should throw for arrays with invalid items", () => {
        expect(() => vArrayOfLengthBetween(vNumber, 2, 4)([1, "2", 3])).toThrow(new SingleValidationError("number", "2"));
    });

    test("should pass type checking", () => {
        const v1: Validator<number[]> = vArrayOfLengthBetween(vNumber, 2, 4);
        const result1: number[] = vArrayOfLengthBetween(vNumber, 2, 4)([1, 2, 3] as unknown);

        // @ts-expect-error
        const result2: number = vArrayOfLengthBetween(vNumber, 2, 4)([1, 2, 3] as unknown);
    });
});

describe("vArrayOfAtLeastLength", () => {
    test("should exist", () => {
        expect(vArrayOfAtLeastLength).toBeDefined();
    });

    test("should validate arrays at or above minimum length", () => {
        expect(vArrayOfAtLeastLength(vNumber, 2)([1, 2])).toEqual([1, 2]);
        expect(vArrayOfAtLeastLength(vNumber, 2)([1, 2, 3])).toEqual([1, 2, 3]);
        expect(vArrayOfAtLeastLength(vString, 0)([])).toEqual([]);
    });

    test("should throw for arrays below minimum length", () => {
        expect(() => vArrayOfAtLeastLength(vNumber, 2)([1])).toThrow(new SingleValidationError("array of at least length 2", [1]));
        expect(() => vArrayOfAtLeastLength(vNumber, 3)([])).toThrow(new SingleValidationError("array of at least length 3", []));
    });

    test("should throw for non-arrays", () => {
        expect(() => vArrayOfAtLeastLength(vNumber, 2)(1)).toThrow(new SingleValidationError("array of at least length 2", 1));
        expect(() => vArrayOfAtLeastLength(vNumber, 2)("test")).toThrow(new SingleValidationError("array of at least length 2", "test"));
        expect(() => vArrayOfAtLeastLength(vNumber, 2)(null)).toThrow(new SingleValidationError("array of at least length 2", null));
        expect(() => vArrayOfAtLeastLength(vNumber, 2)(undefined)).toThrow(new SingleValidationError("array of at least length 2", undefined));
        expect(() => vArrayOfAtLeastLength(vNumber, 2)({})).toThrow(new SingleValidationError("array of at least length 2", {}));
    });

    test("should throw for arrays with invalid items", () => {
        expect(() => vArrayOfAtLeastLength(vNumber, 2)([1, "2"])).toThrow(new SingleValidationError("number", "2"));
    });

    test("should pass type checking", () => {
        const v1: Validator<number[]> = vArrayOfAtLeastLength(vNumber, 2);
        const result1: number[] = vArrayOfAtLeastLength(vNumber, 2)([1, 2, 3] as unknown);

        // @ts-expect-error
        const result2: number = vArrayOfAtLeastLength(vNumber, 2)([1, 2, 3] as unknown);
    });
});

describe("vArrayOfAtMostLength", () => {
    test("should exist", () => {
        expect(vArrayOfAtMostLength).toBeDefined();
    });

    test("should validate arrays at or below maximum length", () => {
        expect(vArrayOfAtMostLength(vNumber, 3)([1, 2, 3])).toEqual([1, 2, 3]);
        expect(vArrayOfAtMostLength(vNumber, 3)([1, 2])).toEqual([1, 2]);
        expect(vArrayOfAtMostLength(vString, 2)([])).toEqual([]);
    });

    test("should throw for arrays above maximum length", () => {
        expect(() => vArrayOfAtMostLength(vNumber, 3)([1, 2, 3, 4])).toThrow(new SingleValidationError("array of at most length 3", [1, 2, 3, 4]));
        expect(() => vArrayOfAtMostLength(vNumber, 0)([1])).toThrow(new SingleValidationError("array of at most length 0", [1]));
    });

    test("should throw for non-arrays", () => {
        expect(() => vArrayOfAtMostLength(vNumber, 3)(1)).toThrow(new SingleValidationError("array of at most length 3", 1));
        expect(() => vArrayOfAtMostLength(vNumber, 3)("test")).toThrow(new SingleValidationError("array of at most length 3", "test"));
        expect(() => vArrayOfAtMostLength(vNumber, 3)(null)).toThrow(new SingleValidationError("array of at most length 3", null));
        expect(() => vArrayOfAtMostLength(vNumber, 3)(undefined)).toThrow(new SingleValidationError("array of at most length 3", undefined));
        expect(() => vArrayOfAtMostLength(vNumber, 3)({})).toThrow(new SingleValidationError("array of at most length 3", {}));
    });

    test("should throw for arrays with invalid items", () => {
        expect(() => vArrayOfAtMostLength(vNumber, 3)([1, 2, "3"])).toThrow(new SingleValidationError("number", "3"));
    });

    test("should pass type checking", () => {
        const v1: Validator<number[]> = vArrayOfAtMostLength(vNumber, 3);
        const result1: number[] = vArrayOfAtMostLength(vNumber, 3)([1, 2, 3] as unknown);

        // @ts-expect-error
        const result2: number = vArrayOfAtMostLength(vNumber, 3)([1, 2, 3] as unknown);
    });
});

describe("vNonemptyArrayOf", () => {
    test("should exist", () => {
        expect(vNonemptyArrayOf).toBeDefined();
    });

    test("should validate non-empty arrays", () => {
        expect(vNonemptyArrayOf(vNumber)([1])).toEqual([1]);
        expect(vNonemptyArrayOf(vNumber)([1, 2, 3])).toEqual([1, 2, 3]);
        expect(vNonemptyArrayOf(vString)(["a", "b"])).toEqual(["a", "b"]);
    });

    test("should throw for empty arrays", () => {
        expect(() => vNonemptyArrayOf(vNumber)([])).toThrow(new SingleValidationError("array of at least length 1", []));
    });

    test("should throw for non-arrays", () => {
        expect(() => vNonemptyArrayOf(vNumber)(1)).toThrow(new SingleValidationError("array of at least length 1", 1));
        expect(() => vNonemptyArrayOf(vNumber)("test")).toThrow(new SingleValidationError("array of at least length 1", "test"));
        expect(() => vNonemptyArrayOf(vNumber)(null)).toThrow(new SingleValidationError("array of at least length 1", null));
        expect(() => vNonemptyArrayOf(vNumber)(undefined)).toThrow(new SingleValidationError("array of at least length 1", undefined));
        expect(() => vNonemptyArrayOf(vNumber)({})).toThrow(new SingleValidationError("array of at least length 1", {}));
    });

    test("should throw for arrays with invalid items", () => {
        expect(() => vNonemptyArrayOf(vNumber)([1, "2"])).toThrow(new SingleValidationError("number", "2"));
    });

    test("should pass type checking", () => {
        const v1: Validator<number[]> = vNonemptyArrayOf(vNumber);
        const result1: number[] = vNonemptyArrayOf(vNumber)([1, 2, 3] as unknown);

        // @ts-expect-error
        const result2: number = vNonemptyArrayOf(vNumber)([1, 2, 3] as unknown);
    });
});
