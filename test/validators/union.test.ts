import { describe, test, expect } from "vitest";
import { vUnion } from "../../src/validators/union";
import { vNumber } from "../../src/validators/number";
import { vString } from "../../src/validators/string";
import { vNull, vTrue, vFalse } from "../../src/validators/const";
import { UnionValidationError } from "../../src/errors/union";
import { SingleValidationError } from "../../src/errors/single";
import { transformingValidator, type Validator } from "../../src/validator-helpers/validator";

describe("vUnion", () => {
    test("should exist", () => {
        expect(vUnion).toBeDefined();
    });

    test("should validate values matching first validator", () => {
        expect(vUnion(vNumber, vString)(1)).toEqual(1);
        expect(vUnion(vNumber, vString)(0)).toEqual(0);
        expect(vUnion(vNumber, vString)(NaN)).toEqual(NaN);
    });

    test("should validate values matching second validator", () => {
        expect(vUnion(vNumber, vString)("test")).toEqual("test");
        expect(vUnion(vNumber, vString)("")).toEqual("");
    });

    test("should short circuit on first passing validator", () => {
        const v = vUnion(vNumber, transformingValidator(() => expect.fail("Should not be called")));
        expect(v(1)).toEqual(1);
    });

    test("should throw UnionValidationError when no validators match", () => {
        expect(() => vUnion(vNumber, vString)(true))
            .toThrow(new UnionValidationError([
                new SingleValidationError("number", true),
                new SingleValidationError("string", true),
            ], true));
    });

    test("should rethrow non-ValidationError errors", () => {
        const vThrow = () => { throw new Error("Test error"); };
        expect(() => vUnion(vThrow)("test")).toThrow(new Error("Test error"));
    });

    test("should pass type checking", () => {
        const v1: Validator<number | string> = vUnion(vNumber, vString);
        const v2 = vUnion(vNumber, vString);
        const result1: number | string = v2(1 as unknown);

        // @ts-expect-error
        const result2: number = v1(1 as unknown);
    });
});
