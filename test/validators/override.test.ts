import { describe, test, expect } from "vitest";
import { vOverride } from "../../src/validators/override";
import type { Validator } from "../../src/validator-helpers/validator";
import { vNumber } from "../../src/validators/number";

describe("vOverride", () => {
    test("should exist", () => {
        expect(vOverride).toBeDefined();
    });

    test("should return override value when override is not a function", () => {
        expect(vOverride(42)(1)).toEqual(42);
        expect(vOverride(42)("test")).toEqual(42);
        expect(vOverride(42)(null)).toEqual(42);
        expect(vOverride(42)(undefined)).toEqual(42);
        expect(vOverride("hello")(1)).toEqual("hello");
        expect(vOverride(null)(1)).toEqual(null);
        expect(vOverride(undefined)(1)).toEqual(undefined);
    });

    test("should call function override with original value", () => {
        const receivedValues: unknown[] = [];
        const overrideFn = (originalValue: unknown) => {
            receivedValues.push(originalValue);
            return "override";
        };
        expect(vOverride(overrideFn)(1)).toEqual("override");
        expect(receivedValues).toEqual([1]);
        expect(vOverride(overrideFn)("test")).toEqual("override");
        expect(receivedValues).toEqual([1, "test"]);
        expect(vOverride(overrideFn)(null)).toEqual("override");
        expect(receivedValues).toEqual([1, "test", null]);
    });

    test("should return function result from function override", () => {
        expect(vOverride(() => 99)(1)).toEqual(99);
        expect(vOverride(() => "result")("test")).toEqual("result");
        expect(vOverride(val => vNumber(val) * 2)(5)).toEqual(10);
    });

    test("should pass type checking", () => {
        const v1: Validator<number> = vOverride(42);
        const result1: number = vOverride(42)(1 as unknown);

        // @ts-expect-error
        const result2: string = vOverride(42)(1 as unknown);

        const v2: Validator<string> = vOverride(() => "test");
        const result3: string = vOverride(() => "test")(1 as unknown);

        // @ts-expect-error
        const result4: number = vOverride(() => "test")(1 as unknown);
    });
});
