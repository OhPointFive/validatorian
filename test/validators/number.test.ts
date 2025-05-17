import { describe, test, expect } from "vitest";
import { SingleValidationError } from "../../src/errors/single";
import { vNumber, vNumberBetween, vRealNumber } from "../../src/validators/number";

describe("vNumber", () => {
    test("should exist", () => {
        expect(vNumber).toBeDefined();
    });

    test("should validate numbers", () => {
        expect(vNumber(0)).toEqual(0);
        expect(vNumber(22)).toEqual(22);
        expect(vNumber(4.321e30)).toEqual(4.321e30);
    });

    test("should validate unusual numbers", () => {
        expect(vNumber(-0)).toEqual(-0);
        expect(vNumber(Number.MAX_VALUE)).toEqual(Number.MAX_VALUE);
        expect(vNumber(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);
        expect(vNumber(Number.MIN_VALUE)).toEqual(Number.MIN_VALUE);
        expect(vNumber(Number.MIN_SAFE_INTEGER)).toEqual(Number.MIN_SAFE_INTEGER);
    });

    test("should validate non-real numbers", () => {
        expect(vNumber(-0)).toEqual(-0);
        expect(vNumber(Number.MAX_VALUE)).toEqual(Number.MAX_VALUE);
        expect(vNumber(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);
        expect(vNumber(Number.MIN_VALUE)).toEqual(Number.MIN_VALUE);
        expect(vNumber(Number.MIN_SAFE_INTEGER)).toEqual(Number.MIN_SAFE_INTEGER);
        expect(vNumber(Number.POSITIVE_INFINITY)).toEqual(Number.POSITIVE_INFINITY);
        expect(vNumber(Number.NEGATIVE_INFINITY)).toEqual(Number.NEGATIVE_INFINITY);
        expect(vNumber(NaN)).toEqual(NaN);
    });

    test("should throw for non-numbers", () => {
        expect(() => vNumber("string")).toThrow(new SingleValidationError("number", "string"));
        expect(() => vNumber(true)).toThrow(new SingleValidationError("number", true));
        expect(() => vNumber(null)).toThrow(new SingleValidationError("number", null));
        expect(() => vNumber(undefined)).toThrow(new SingleValidationError("number", undefined));
        expect(() => vNumber({})).toThrow(new SingleValidationError("number", {}));
        const func = () => {};
        expect(() => vNumber(func)).toThrow(new SingleValidationError("number", func));
    });
});

describe("vRealNumber", () => {
    test("should exist", () => {
        expect(vRealNumber).toBeDefined();
    });

    test("should validate real numbers", () => {
        expect(vRealNumber(0)).toEqual(0);
        expect(vRealNumber(22)).toEqual(22);
        expect(vRealNumber(4.321e30)).toEqual(4.321e30);
    });

    test("should validate weird numbers", () => {
        expect(vRealNumber(-0)).toEqual(-0);
        expect(vRealNumber(Number.MAX_VALUE)).toEqual(Number.MAX_VALUE);
        expect(vRealNumber(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);
        expect(vRealNumber(Number.MIN_VALUE)).toEqual(Number.MIN_VALUE);
        expect(vRealNumber(Number.MIN_SAFE_INTEGER)).toEqual(Number.MIN_SAFE_INTEGER);
    });

    test("should throw for non-real numbers", () => {
        expect(() => vRealNumber(Number.POSITIVE_INFINITY)).toThrow(new SingleValidationError("real number", Number.POSITIVE_INFINITY));
        expect(() => vRealNumber(Number.NEGATIVE_INFINITY)).toThrow(new SingleValidationError("real number", Number.NEGATIVE_INFINITY));
        expect(() => vRealNumber(NaN)).toThrow(new SingleValidationError("real number", NaN));
    });

    test("should throw for non-numbers", () => {
        expect(() => vRealNumber("string")).toThrow(new SingleValidationError("real number", "string"));
        expect(() => vRealNumber(true)).toThrow(new SingleValidationError("real number", true));
        expect(() => vRealNumber(null)).toThrow(new SingleValidationError("real number", null));
        expect(() => vRealNumber(undefined)).toThrow(new SingleValidationError("real number", undefined));
        expect(() => vRealNumber({})).toThrow(new SingleValidationError("real number", {}));
        const func = () => {};
        expect(() => vRealNumber(func)).toThrow(new SingleValidationError("real number", func));
    });
});

describe("vNumberBetween", () => {
    test("should exist", () => {
        expect(vNumberBetween).toBeDefined();
    });

    test("should validate numbers between min and max", () => {
        expect(vNumberBetween(0, 10)(5)).toEqual(5);
        expect(vNumberBetween(-10, 10)(0)).toEqual(0);
        expect(vNumberBetween(1e30, 1e32)(1e31)).toEqual(1e31);
    });

    test("should validate numbers equal to min", () => {
        expect(vNumberBetween(0, 10)(0)).toEqual(0);
        expect(vNumberBetween(-10, 10)(-10)).toEqual(-10);
        expect(vNumberBetween(1e30, 1e32)(1e30)).toEqual(1e30);
    });

    test("should throw for numbers equal to max", () => {
        expect(() => vNumberBetween(0, 10)(10)).toThrow(new SingleValidationError("number between 0 and 10", 10));
        expect(() => vNumberBetween(-10, 10)(10)).toThrow(new SingleValidationError("number between -10 and 10", 10));
        expect(() => vNumberBetween(1e30, 1e32)(1e32)).toThrow(new SingleValidationError("number between 1e+30 and 1e+32", 1e32));
    });

    test("should throw for numbers less than min", () => {
        expect(() => vNumberBetween(0, 10)(-1)).toThrow(new SingleValidationError("number between 0 and 10", -1));
        expect(() => vNumberBetween(-10, 10)(-11)).toThrow(new SingleValidationError("number between -10 and 10", -11));
        expect(() => vNumberBetween(1e30, 1e32)(1e29)).toThrow(new SingleValidationError("number between 1e+30 and 1e+32", 1e29));
    });

    test("should throw for numbers greater than max", () => {
        expect(() => vNumberBetween(0, 10)(11)).toThrow(new SingleValidationError("number between 0 and 10", 11));
        expect(() => vNumberBetween(-10, 10)(11)).toThrow(new SingleValidationError("number between -10 and 10", 11));
        expect(() => vNumberBetween(1e30, 1e32)(1e33)).toThrow(new SingleValidationError("number between 1e+30 and 1e+32", 1e33));
    });

    test("should throw for non-real numbers", () => {
        expect(() => vNumberBetween(0, 10)(Number.POSITIVE_INFINITY)).toThrow(new SingleValidationError("number between 0 and 10", Number.POSITIVE_INFINITY));
        expect(() => vNumberBetween(0, 10)(Number.NEGATIVE_INFINITY)).toThrow(new SingleValidationError("number between 0 and 10", Number.NEGATIVE_INFINITY));
        expect(() => vNumberBetween(0, 10)(NaN)).toThrow(new SingleValidationError("number between 0 and 10", NaN));
    });

    test("should throw for non-numbers", () => {
        expect(() => vNumberBetween(0, 10)("string")).toThrow(new SingleValidationError("number between 0 and 10", "string"));
        expect(() => vNumberBetween(0, 10)(true)).toThrow(new SingleValidationError("number between 0 and 10", true));
        expect(() => vNumberBetween(0, 10)(null)).toThrow(new SingleValidationError("number between 0 and 10", null));
        expect(() => vNumberBetween(0, 10)(undefined)).toThrow(new SingleValidationError("number between 0 and 10", undefined));
        expect(() => vNumberBetween(0, 10)({})).toThrow(new SingleValidationError("number between 0 and 10", {}));
        const func = () => {};
        expect(() => vNumberBetween(0, 10)(func)).toThrow(new SingleValidationError("number between 0 and 10", func));
    });
});
