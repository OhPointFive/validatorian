import { describe, test, expect } from "vitest";
import { vOptional, vNullable, vOrUndefined } from "../../src/validators/optional";
import { vNumber } from "../../src/validators/number";
import { vString } from "../../src/validators/string";
import { UnionValidationError } from "../../src/errors/union";
import { SingleValidationError } from "../../src/errors/single";
import type { Validator } from "../../src/validator-helpers/validator";

describe("vOptional", () => {
    test("should exist", () => {
        expect(vOptional).toBeDefined();
    });

    test("should validate with the wrapped validator", () => {
        expect(vOptional(vNumber)(1)).toEqual(1);
        expect(vOptional(vNumber)(0)).toEqual(0);
        expect(vOptional(vString)("test")).toEqual("test");
    });

    test("should validate undefined", () => {
        expect(vOptional(vNumber)(undefined)).toEqual(undefined);
        expect(vOptional(vString)(undefined)).toEqual(undefined);
    });

    test("should validate null", () => {
        expect(vOptional(vNumber)(null)).toEqual(null);
        expect(vOptional(vString)(null)).toEqual(null);
    });

    test("should throw UnionValidationError for invalid values", () => {
        expect(() => vOptional(vNumber)("test"))
            .toThrow(new UnionValidationError([
                new SingleValidationError("number", "test"),
                new SingleValidationError("undefined", "test"),
                new SingleValidationError("null", "test"),
            ], "test"));
        expect(() => vOptional(vString)(1))
            .toThrow(new UnionValidationError([
                new SingleValidationError("string", 1),
                new SingleValidationError("undefined", 1),
                new SingleValidationError("null", 1),
            ], 1));
    });

    test("should pass type checking", () => {
        const v1: Validator<number | undefined | null> = vOptional(vNumber);
        const result1: number | undefined | null = vOptional(vNumber)(1 as unknown);

        // @ts-expect-error
        const result2: number = vOptional(vNumber)(1 as unknown);
    });
});

describe("vNullable", () => {
    test("should exist", () => {
        expect(vNullable).toBeDefined();
    });

    test("should validate with the wrapped validator", () => {
        expect(vNullable(vNumber)(1)).toEqual(1);
        expect(vNullable(vNumber)(0)).toEqual(0);
        expect(vNullable(vString)("test")).toEqual("test");
    });

    test("should validate null", () => {
        expect(vNullable(vNumber)(null)).toEqual(null);
        expect(vNullable(vString)(null)).toEqual(null);
    });

    test("should throw UnionValidationError for undefined", () => {
        expect(() => vNullable(vNumber)(undefined))
            .toThrow(new UnionValidationError([
                new SingleValidationError("number", undefined),
                new SingleValidationError("null", undefined),
            ], undefined));
    });

    test("should throw UnionValidationError for invalid values", () => {
        expect(() => vNullable(vNumber)("test"))
            .toThrow(new UnionValidationError([
                new SingleValidationError("number", "test"),
                new SingleValidationError("null", "test"),
            ], "test"));
        expect(() => vNullable(vString)(1))
            .toThrow(new UnionValidationError([
                new SingleValidationError("string", 1),
                new SingleValidationError("null", 1),
            ], 1));
    });

    test("should pass type checking", () => {
        const v1: Validator<number | null> = vNullable(vNumber);
        const result1: number | null = vNullable(vNumber)(1 as unknown);

        // @ts-expect-error
        const result2: number = vNullable(vNumber)(1 as unknown);
    });
});

describe("vOrUndefined", () => {
    test("should exist", () => {
        expect(vOrUndefined).toBeDefined();
    });

    test("should validate with the wrapped validator", () => {
        expect(vOrUndefined(vNumber)(1)).toEqual(1);
        expect(vOrUndefined(vNumber)(0)).toEqual(0);
        expect(vOrUndefined(vString)("test")).toEqual("test");
    });

    test("should validate undefined", () => {
        expect(vOrUndefined(vNumber)(undefined)).toEqual(undefined);
        expect(vOrUndefined(vString)(undefined)).toEqual(undefined);
    });

    test("should throw UnionValidationError for null", () => {
        expect(() => vOrUndefined(vNumber)(null))
            .toThrow(new UnionValidationError([
                new SingleValidationError("number", null),
                new SingleValidationError("undefined", null),
            ], null));
    });

    test("should throw UnionValidationError for invalid values", () => {
        expect(() => vOrUndefined(vNumber)("test"))
            .toThrow(new UnionValidationError([
                new SingleValidationError("number", "test"),
                new SingleValidationError("undefined", "test"),
            ], "test"));
        expect(() => vOrUndefined(vString)(1))
            .toThrow(new UnionValidationError([
                new SingleValidationError("string", 1),
                new SingleValidationError("undefined", 1),
            ], 1));
    });

    test("should pass type checking", () => {
        const v1: Validator<number | undefined> = vOrUndefined(vNumber);
        const result1: number | undefined = vOrUndefined(vNumber)(1 as unknown);

        // @ts-expect-error
        const result2: number = vOrUndefined(vNumber)(1 as unknown);
    });
});
