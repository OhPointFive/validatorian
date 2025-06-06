import { describe, test, expect } from "vitest";
import { SingleValidationError } from "../../src/errors/single";
import { vObject } from "../../src/validators/object";
import { vNumber } from "../../src/validators/number";
import { vString } from "../../src/validators/string";
import { Validator } from "../../src/validator-helpers/validator";

describe("vObject", () => {
    test("should exist", () => {
        expect(vObject).toBeDefined();
    });

    test("should simple cases", () => {
        expect(vObject({ number: vNumber, string: vString })({ number: 1, string: "string" })).toEqual({ number: 1, string: "string" });
    });

    test("should drop extra keys", () => {
        expect(vObject({ number: vNumber, string: vString })({ number: 1, string: "string", extra: "extra" })).toEqual({ number: 1, string: "string" });
    });

    test("should handle missing keys", () => {
        expect(vObject({ number: vNumber, any: v => v })({ number: 1 })).toEqual({ number: 1, any: undefined });
    });

    test("should work with numeric keys", () => {
        expect(vObject({ 0: vNumber, 1: vString })({ 0: 1, 1: "string" })).toEqual({ 0: 1, 1: "string" });
    });

    test("should work with symbol keys", () => {
        const symbol = Symbol("test");
        expect(vObject({ [symbol]: vString })({ [symbol]: "string" })).toEqual({ [symbol]: "string" });
    });

    test("should validate strange objects", () => {
        const strangeObject1 = [] as unknown as { number: number, string: string };
        strangeObject1.number = 1;
        strangeObject1.string = "string";
        expect(vObject({ number: vNumber, string: vString })(strangeObject1)).toEqual({ number: 1, string: "string" });

        const strangeObject2 = [] as unknown as { length: number, string: string };
        strangeObject2.string = "string";
        expect(vObject({ length: vNumber, string: vString })(strangeObject2)).toEqual({ length: 0, string: "string" });

        const strangeObject3 = /test/g as unknown as { source: string, flags: string, value: string };
        strangeObject3.value = "value";
        expect(vObject({ source: vString, flags: vString, value: vString })(strangeObject3)).toEqual({ source: "test", flags: "g", value: "value" });
    });

    test("should validate nested objects", () => {
        const vTest = vObject({
            nested: vObject({
                number: vNumber,
                string: vString,
            }),
            number: vNumber,
            string: vString,
        });
        expect(vTest({ number: 1, string: "string", nested: { number: 2, string: "string2" } }))
            .toEqual({ number: 1, string: "string", nested: { number: 2, string: "string2" } });
    });

    test("should reject on non-objects", () => {
        expect(() => vObject({ number: vNumber, string: vString })(1)).toThrow(new SingleValidationError("object", 1));
        expect(() => vObject({ number: vNumber, string: vString })("string")).toThrow(new SingleValidationError("object", "string"));
        expect(() => vObject({ number: vNumber, string: vString })(true)).toThrow(new SingleValidationError("object", true));
        expect(() => vObject({ number: vNumber, string: vString })(null)).toThrow(new SingleValidationError("object", null));
        expect(() => vObject({ number: vNumber, string: vString })(undefined)).toThrow(new SingleValidationError("object", undefined));
        const symbol = Symbol("test");
        expect(() => vObject({ number: vNumber, string: vString })(symbol)).toThrow(new SingleValidationError("object", symbol));
        const func = () => {};
        expect(() => vObject({ number: vNumber, string: vString })(func)).toThrow(new SingleValidationError("object", func));
    });

    test("should reject when a value is wrong", () => {
        expect(() => vObject({ number: vNumber, string: vString })({ number: "not a number", string: "string" }))
            .toThrow(new SingleValidationError("number", "not a number", ["number"]));
        expect(() => vObject({ number: vNumber, string: vString })({ number: 1, string: 2 }))
            .toThrow(new SingleValidationError("string", 2, ["string"]));
        expect(() => vObject({ number: vNumber, pathTest: vString })({ number: 1, pathTest: true }))
            .toThrow(new SingleValidationError("string", true, ["pathTest"]));
    });

    test("should reject when a value is undefined", () => {
        expect(() => vObject({ number: vNumber, pathTest: vString })({ number: 1 }))
            .toThrow(new SingleValidationError("string", undefined, ["pathTest"]));
    });

    test("should reject when a nested value is wrong", () => {
        const vTest = vObject({
            nested: vObject({
                number: vNumber,
                string: vString,
            }),
            number: vNumber,
            string: vString,
        });
        expect(() => vTest({ number: 1, string: "string", nested: { number: 2, string: 3 } }))
            .toThrow(new SingleValidationError("string", 3, ["nested", "string"]));
    });

    test("should rethrow unrecognized errors", () => {
        const vTest = vObject({
            value: v => { throw new Error("Test error"); },
        });
        expect(() => vTest({})).toThrow(new Error("Test error"));
    });

    test("should pass type checking", () => {
        interface TestInterface {
            number: number;
            string: string;
            nested: {
                number: number;
                string: string;
            };
        };

        const vTest: Validator<TestInterface> = vObject<TestInterface>({
            number: vNumber,
            string: vString,
            nested: vObject({
                number: vNumber,
                string: vString,
            }),
        });

        const vTest2 = vObject({
            number: vNumber,
            string: vString,
            nested: vObject({
                number: vNumber,
                string: vString,
            }),
        });

        const result1: TestInterface = vTest({ number: 1, string: "string", nested: { number: 2, string: "string2" } });
        const result2: TestInterface = vTest2({ number: 1, string: "string", nested: { number: 2, string: "string2" } });
    });

    test("should fail type checking", () => {
        interface TestInterface {
            number: number;
            string: string;
            nested: {
                number: number;
                string: string;
            };
        };

        const vTest: Validator<TestInterface> = vObject<TestInterface>({
            number: vNumber,
            string: vString,
            // @ts-expect-error
            nested: vObject({
                number: vNumber,
                string: vNumber,
            }),
        });

        const result1: TestInterface = vTest({ number: 1, string: "string", nested: { number: 2, string: 3 } });

        const vTest2 = vObject({
            number: vNumber,
            string: vString,
            nested: vObject({
                number: vNumber,
                string: vNumber,
            }),
        });

        // @ts-expect-error
        const result2: TestInterface = vTest2({ number: 1, string: "string", nested: { number: 2, string: 3 } });

        // @ts-expect-error
        vObject(4);

        // @ts-expect-error
        vObject("test string");

        // @ts-expect-error
        vObject(null);

        // @ts-expect-error
        vObject(undefined);

        // @ts-expect-error
        vObject(Symbol());
    });
});
