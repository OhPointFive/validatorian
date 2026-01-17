import { describe, test, expect } from "vitest";
import { SingleValidationError } from "../../src/errors/single";
import { vTuple, vStrictTuple } from "../../src/validators/tuple";
import { vNumber } from "../../src/validators/number";
import { vString } from "../../src/validators/string";
import { vOrUndefined } from "../../src/validators/optional";
import type { Validator } from "../../src/validator-helpers/validator";

describe("vTuple", () => {
    test("should exist", () => {
        expect(vTuple).toBeDefined();
    });

    test("should validate tuples with correct items", () => {
        expect(vTuple(vNumber, vString)([1, "test"])).toEqual([1, "test"]);
        expect(vTuple(vString, vNumber, vString)(["a", 2, "c"])).toEqual(["a", 2, "c"]);
    });

    test("should handle too short arrays with undefined", () => {
        expect(vTuple(vNumber, vOrUndefined(vString))([1])).toEqual([1, undefined]);
        expect(vTuple(vOrUndefined(vNumber), vOrUndefined(vString))([])).toEqual([undefined, undefined]);
    });

    test("should drop extra items from too long arrays", () => {
        expect(vTuple(vNumber, vString)([1, "test", "extra"])).toEqual([1, "test"]);
        expect(vTuple(vNumber)([1, 2, 3, 4, 5])).toEqual([1]);
    });

    test("should throw for non-arrays", () => {
        expect(() => vTuple(vNumber, vString)(1)).toThrow(new SingleValidationError("tuple", 1));
        expect(() => vTuple(vNumber, vString)("test")).toThrow(new SingleValidationError("tuple", "test"));
        expect(() => vTuple(vNumber, vString)(null)).toThrow(new SingleValidationError("tuple", null));
        expect(() => vTuple(vNumber, vString)(undefined)).toThrow(new SingleValidationError("tuple", undefined));
        expect(() => vTuple(vNumber, vString)({})).toThrow(new SingleValidationError("tuple", {}));
    });

    test("should throw for tuples with invalid items", () => {
        expect(() => vTuple(vNumber, vString)([1, 2])).toThrow(new SingleValidationError("string", 2));
        expect(() => vTuple(vString, vNumber)(["a", "b"])).toThrow(new SingleValidationError("number", "b"));
    });

    test("should pass type checking", () => {
        const v1: Validator<[number, string]> = vTuple(vNumber, vString);
        const result1: [number, string] = vTuple(vNumber, vString)([1, "test"] as unknown);

        // @ts-expect-error
        const result2: [string, number] = vTuple(vNumber, vString)([1, "test"] as unknown);
    });
});

describe("vStrictTuple", () => {
    test("should exist", () => {
        expect(vStrictTuple).toBeDefined();
    });

    test("should validate tuples with correct items and length", () => {
        expect(vStrictTuple(vNumber, vString)([1, "test"])).toEqual([1, "test"]);
        expect(vStrictTuple(vString, vNumber, vString)(["a", 2, "c"])).toEqual(["a", 2, "c"]);
    });

    test("should throw for too short arrays", () => {
        expect(() => vStrictTuple(vNumber, vString)([1])).toThrow(new SingleValidationError("tuple of length 2", [1]));
        expect(() => vStrictTuple(vNumber, vString, vNumber)([1, "test"])).toThrow(new SingleValidationError("tuple of length 3", [1, "test"]));
        expect(() => vStrictTuple(vNumber)([])).toThrow(new SingleValidationError("tuple of length 1", []));
    });

    test("should throw for too long arrays", () => {
        expect(() => vStrictTuple(vNumber, vString)([1, "test", "extra"])).toThrow(new SingleValidationError("tuple of length 2", [1, "test", "extra"]));
        expect(() => vStrictTuple(vNumber)([1, 2])).toThrow(new SingleValidationError("tuple of length 1", [1, 2]));
    });

    test("should throw for non-arrays", () => {
        expect(() => vStrictTuple(vNumber, vString)(1)).toThrow(new SingleValidationError("tuple of length 2", 1));
        expect(() => vStrictTuple(vNumber, vString)("test")).toThrow(new SingleValidationError("tuple of length 2", "test"));
        expect(() => vStrictTuple(vNumber, vString)(null)).toThrow(new SingleValidationError("tuple of length 2", null));
        expect(() => vStrictTuple(vNumber, vString)(undefined)).toThrow(new SingleValidationError("tuple of length 2", undefined));
        expect(() => vStrictTuple(vNumber, vString)({})).toThrow(new SingleValidationError("tuple of length 2", {}));
    });

    test("should throw for tuples with invalid items", () => {
        expect(() => vStrictTuple(vNumber, vString)([1, 2])).toThrow(new SingleValidationError("string", 2));
        expect(() => vStrictTuple(vString, vNumber)(["a", "b"])).toThrow(new SingleValidationError("number", "b"));
    });

    test("should pass type checking", () => {
        const v1: Validator<[number, string]> = vStrictTuple(vNumber, vString);
        const result1: [number, string] = vStrictTuple(vNumber, vString)([1, "test"] as unknown);

        // @ts-expect-error
        const result2: [string, number] = vStrictTuple(vNumber, vString)([1, "test"] as unknown);
    });
});
