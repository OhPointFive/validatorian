import { describe, test, expect } from "vitest";
import { vWithDefault, vWithFallback } from "../../src/validators/default";
import { vNumber } from "../../src/validators/number";
import { vString } from "../../src/validators/string";
import { SingleValidationError } from "../../src/errors/single";
import type { Validator } from "../../src/validator-helpers/validator";

describe("vWithDefault", () => {
    test("should exist", () => {
        expect(vWithDefault).toBeDefined();
    });

    test("should validate with wrapped validator when value is not null or undefined", () => {
        expect(vWithDefault(vNumber, 0)(1)).toEqual(1);
        expect(vWithDefault(vNumber, 0)(42)).toEqual(42);
        expect(vWithDefault(vString, "default")("test")).toEqual("test");
    });

    test("should return default value when value is null", () => {
        expect(vWithDefault(vNumber, 0)(null)).toEqual(0);
        expect(vWithDefault(vString, "default")(null)).toEqual("default");
        expect(vWithDefault(vNumber, 42)(null)).toEqual(42);
    });

    test("should return default value when value is undefined", () => {
        expect(vWithDefault(vNumber, 0)(undefined)).toEqual(0);
        expect(vWithDefault(vString, "default")(undefined)).toEqual("default");
        expect(vWithDefault(vNumber, 42)(undefined)).toEqual(42);
    });

    test("should call function default when value is null or undefined", () => {
        let callCount = 0;
        const defaultFn = () => {
            callCount++;
            return callCount;
        };
        expect(vWithDefault(vNumber, defaultFn)(null)).toEqual(1);
        expect(vWithDefault(vNumber, defaultFn)(undefined)).toEqual(2);
    });

    test("should throw for invalid values that are not null or undefined", () => {
        expect(() => vWithDefault(vNumber, 0)("test")).toThrow(new SingleValidationError("number", "test"));
        expect(() => vWithDefault(vString, "default")(1)).toThrow(new SingleValidationError("string", 1));
    });

    test("should pass type checking", () => {
        const v1: Validator<number | string> = vWithDefault(vNumber, "default");
        const result1: number | string = vWithDefault(vNumber, "default")(1 as unknown);

        // @ts-expect-error
        const result2: number = vWithDefault(vNumber, "default")(1 as unknown);

        const v2: Validator<number | string> = vWithDefault(vNumber, () => "default");
        const result3: number | string = vWithDefault(vNumber, () => "default")(1 as unknown);

        // @ts-expect-error
        const result4: number = vWithDefault(vNumber, () => "default")(1 as unknown);
    });
});

describe("vWithFallback", () => {
    test("should exist", () => {
        expect(vWithFallback).toBeDefined();
    });

    test("should validate with wrapped validator when validation succeeds", () => {
        expect(vWithFallback(vNumber, 0)(1)).toEqual(1);
        expect(vWithFallback(vNumber, 0)(42)).toEqual(42);
        expect(vWithFallback(vString, "fallback")("test")).toEqual("test");
    });

    test("should return fallback when validation fails with ValidationError", () => {
        expect(vWithFallback(vNumber, 0)("test")).toEqual(0);
        expect(vWithFallback(vString, "fallback")(1)).toEqual("fallback");
        expect(vWithFallback(vNumber, 42)("invalid")).toEqual(42);
    });

    test("should call function fallback when validation fails", () => {
        let callCount = 0;
        const fallback = () => {
            callCount++;
            return 99;
        };
        expect(vWithFallback(vNumber, fallback)("test")).toEqual(99);
        expect(callCount).toEqual(1);
        expect(vWithFallback(vString, fallback)(1)).toEqual(99);
        expect(callCount).toEqual(2);
    });

    test("should pass original value to function fallback", () => {
        const receivedValues: unknown[] = [];
        const fallback = (originalValue: unknown) => {
            receivedValues.push(originalValue);
            return "fallback";
        };
        expect(vWithFallback(vNumber, fallback)("test")).toEqual("fallback");
        expect(receivedValues).toEqual(["test"]);
        expect(vWithFallback(vNumber, fallback)(42)).toEqual(42);
        expect(receivedValues).toEqual(["test"]);
        expect(vWithFallback(vString, fallback)(42)).toEqual("fallback");
        expect(receivedValues).toEqual(["test", 42]);
    });

    test("should rethrow non-ValidationError errors", () => {
        const vThrow = () => { throw new Error("Test error"); };
        expect(() => vWithFallback(vThrow, "fallback")("test")).toThrow(new Error("Test error"));
    });

    test("should pass type checking", () => {
        const v1: Validator<number | string> = vWithFallback(vNumber, "fallback");
        const result1: number | string = vWithFallback(vNumber, "fallback")(1 as unknown);

        // @ts-expect-error
        const result2: number = vWithFallback(vNumber, "fallback")(1 as unknown);
    });
});
