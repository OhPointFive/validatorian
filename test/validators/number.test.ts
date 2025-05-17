import { describe, test, expect } from "vitest";
import { SingleValidationError } from "../../src/errors/single";
import { vAnyInteger, vInteger, vIntegerBetween, vNaturalNumber, vNonNegativeInteger, vNumber, vNumberBetween, vRealNumber } from "../../src/validators/number";

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
        expect(() => vNumberBetween(1e30, 1e32)(1e32)).toThrow(new SingleValidationError("number between 1e+30 and 1e+32", 1e32));
    });

    test("should throw for numbers less than min", () => {
        expect(() => vNumberBetween(0, 10)(-1)).toThrow(new SingleValidationError("number between 0 and 10", -1));
        expect(() => vNumberBetween(-10, 10)(-11)).toThrow(new SingleValidationError("number between -10 and 10", -11));
        expect(() => vNumberBetween(1e30, 1e32)(1e29)).toThrow(new SingleValidationError("number between 1e+30 and 1e+32", 1e29));
    });

    test("should throw for numbers greater than max", () => {
        expect(() => vNumberBetween(0, 10)(11)).toThrow(new SingleValidationError("number between 0 and 10", 11));
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

describe("vInteger", () => {
    test("should exist", () => {
        expect(vInteger).toBeDefined();
    });

    test("should validate integers", () => {
        expect(vInteger(0)).toEqual(0);
        expect(vInteger(22)).toEqual(22);
        expect(vInteger(-4)).toEqual(-4);
    });

    test("should validate safe integers", () => {
        expect(vInteger(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);
        expect(vInteger(Number.MIN_SAFE_INTEGER)).toEqual(Number.MIN_SAFE_INTEGER);
    });

    test("should throw for non-safe integers", () => {
        expect(() => vInteger(1e30)).toThrow(new SingleValidationError("integer", 1e30));
        expect(() => vInteger(Number.MAX_VALUE)).toThrow(new SingleValidationError("integer", Number.MAX_VALUE));
        expect(() => vInteger(Number.MIN_VALUE)).toThrow(new SingleValidationError("integer", Number.MIN_VALUE));
    });

    test("should throw for non-integers", () => {
        expect(() => vInteger(1.5)).toThrow(new SingleValidationError("integer", 1.5));
        expect(() => vInteger(4.321)).toThrow(new SingleValidationError("integer", 4.321));
        expect(() => vInteger(Number.POSITIVE_INFINITY)).toThrow(new SingleValidationError("integer", Number.POSITIVE_INFINITY));
        expect(() => vInteger(Number.NEGATIVE_INFINITY)).toThrow(new SingleValidationError("integer", Number.NEGATIVE_INFINITY));
        expect(() => vInteger(NaN)).toThrow(new SingleValidationError("integer", NaN));
    });

    test("should throw for non-numbers", () => {
        expect(() => vInteger("string")).toThrow(new SingleValidationError("integer", "string"));
        expect(() => vInteger(true)).toThrow(new SingleValidationError("integer", true));
        expect(() => vInteger(null)).toThrow(new SingleValidationError("integer", null));
        expect(() => vInteger(undefined)).toThrow(new SingleValidationError("integer", undefined));
        expect(() => vInteger({})).toThrow(new SingleValidationError("integer", {}));
        const func = () => {};
        expect(() => vInteger(func)).toThrow(new SingleValidationError("integer", func));
    });
});

describe("vAnyInteger", () => {
    test("should exist", () => {
        expect(vAnyInteger).toBeDefined();
    });

    test("should validate integers", () => {
        expect(vAnyInteger(0)).toEqual(0);
        expect(vAnyInteger(22)).toEqual(22);
        expect(vAnyInteger(-4)).toEqual(-4);
    });

    test("should validate safe integers", () => {
        expect(vAnyInteger(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);
        expect(vAnyInteger(Number.MIN_SAFE_INTEGER)).toEqual(Number.MIN_SAFE_INTEGER);
    });

    test("should validate non-safe integers", () => {
        expect(vAnyInteger(1e30)).toEqual(1e30);
        expect(vAnyInteger(Number.MAX_VALUE)).toEqual(Number.MAX_VALUE);
        expect(vAnyInteger(-Number.MAX_VALUE)).toEqual(-Number.MAX_VALUE);
    });

    test("should throw for non-integers", () => {
        expect(() => vAnyInteger(1.5)).toThrow(new SingleValidationError("any integer", 1.5));
        expect(() => vAnyInteger(4.321)).toThrow(new SingleValidationError("any integer", 4.321));
    });

    test("should throw for non-real numbers", () => {
        expect(() => vAnyInteger(Number.POSITIVE_INFINITY)).toThrow(new SingleValidationError("any integer", Number.POSITIVE_INFINITY));
        expect(() => vAnyInteger(Number.NEGATIVE_INFINITY)).toThrow(new SingleValidationError("any integer", Number.NEGATIVE_INFINITY));
        expect(() => vAnyInteger(NaN)).toThrow(new SingleValidationError("any integer", NaN));
    });

    test("should throw for non-numbers", () => {
        expect(() => vAnyInteger("string")).toThrow(new SingleValidationError("any integer", "string"));
        expect(() => vAnyInteger(true)).toThrow(new SingleValidationError("any integer", true));
        expect(() => vAnyInteger(null)).toThrow(new SingleValidationError("any integer", null));
        expect(() => vAnyInteger(undefined)).toThrow(new SingleValidationError("any integer", undefined));
        expect(() => vAnyInteger({})).toThrow(new SingleValidationError("any integer", {}));
        const func = () => {};
        expect(() => vAnyInteger(func)).toThrow(new SingleValidationError("any integer", func));
    });
});

describe("vNaturalNumber", () => {
    test("should exist", () => {
        expect(vNaturalNumber).toBeDefined();
    });

    test("should validate natural numbers", () => {
        expect(vNaturalNumber(1)).toEqual(1);
        expect(vNaturalNumber(22)).toEqual(22);
        expect(vNaturalNumber(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);
    });

    test("should throw for non-safe integers", () => {
        expect(() => vNaturalNumber(Number.MAX_SAFE_INTEGER + 1)).toThrow(new SingleValidationError("natural number", Number.MAX_SAFE_INTEGER + 1));
    });

    test("should throw for non-natural numbers", () => {
        expect(() => vNaturalNumber(0)).toThrow(new SingleValidationError("natural number", 0));
        expect(() => vNaturalNumber(-1)).toThrow(new SingleValidationError("natural number", -1));
        expect(() => vNaturalNumber(-99)).toThrow(new SingleValidationError("natural number", -99));
        expect(() => vNaturalNumber(Number.MIN_SAFE_INTEGER)).toThrow(new SingleValidationError("natural number", Number.MIN_SAFE_INTEGER));
    });

    test("should throw for non-integers", () => {
        expect(() => vNaturalNumber(1.5)).toThrow(new SingleValidationError("natural number", 1.5));
        expect(() => vNaturalNumber(4.321)).toThrow(new SingleValidationError("natural number", 4.321));
    });

    test("should throw for non-reals", () => {
        expect(() => vNaturalNumber(Number.POSITIVE_INFINITY)).toThrow(new SingleValidationError("natural number", Number.POSITIVE_INFINITY));
        expect(() => vNaturalNumber(Number.NEGATIVE_INFINITY)).toThrow(new SingleValidationError("natural number", Number.NEGATIVE_INFINITY));
        expect(() => vNaturalNumber(NaN)).toThrow(new SingleValidationError("natural number", NaN));
    });

    test("should throw for non-numbers", () => {
        expect(() => vNaturalNumber("string")).toThrow(new SingleValidationError("natural number", "string"));
        expect(() => vNaturalNumber(true)).toThrow(new SingleValidationError("natural number", true));
        expect(() => vNaturalNumber(null)).toThrow(new SingleValidationError("natural number", null));
        expect(() => vNaturalNumber(undefined)).toThrow(new SingleValidationError("natural number", undefined));
        expect(() => vNaturalNumber({})).toThrow(new SingleValidationError("natural number", {}));
        const func = () => {};
        expect(() => vNaturalNumber(func)).toThrow(new SingleValidationError("natural number", func));
    });
});

describe("vNonNegativeInteger", () => {
    test("should exist", () => {
        expect(vNonNegativeInteger).toBeDefined();
    });

    test("should validate non-negative integers", () => {
        expect(vNonNegativeInteger(0)).toEqual(0);
        expect(vNonNegativeInteger(1)).toEqual(1);
        expect(vNonNegativeInteger(22)).toEqual(22);
        expect(vNonNegativeInteger(Number.MAX_SAFE_INTEGER)).toEqual(Number.MAX_SAFE_INTEGER);
    });

    test("should throw for non-safe integers", () => {
        expect(() => vNonNegativeInteger(Number.MAX_SAFE_INTEGER + 1)).toThrow(new SingleValidationError("non-negative integer", Number.MAX_SAFE_INTEGER + 1));
    });

    test("should throw for non-natural numbers", () => {
        expect(() => vNonNegativeInteger(-1)).toThrow(new SingleValidationError("non-negative integer", -1));
        expect(() => vNonNegativeInteger(-99)).toThrow(new SingleValidationError("non-negative integer", -99));
        expect(() => vNonNegativeInteger(Number.MIN_SAFE_INTEGER)).toThrow(new SingleValidationError("non-negative integer", Number.MIN_SAFE_INTEGER));
    });

    test("should throw for non-integers", () => {
        expect(() => vNonNegativeInteger(1.5)).toThrow(new SingleValidationError("non-negative integer", 1.5));
        expect(() => vNonNegativeInteger(4.321)).toThrow(new SingleValidationError("non-negative integer", 4.321));
    });

    test("should throw for non-reals", () => {
        expect(() => vNonNegativeInteger(Number.POSITIVE_INFINITY)).toThrow(new SingleValidationError("non-negative integer", Number.POSITIVE_INFINITY));
        expect(() => vNonNegativeInteger(Number.NEGATIVE_INFINITY)).toThrow(new SingleValidationError("non-negative integer", Number.NEGATIVE_INFINITY));
        expect(() => vNonNegativeInteger(NaN)).toThrow(new SingleValidationError("non-negative integer", NaN));
    });

    test("should throw for non-numbers", () => {
        expect(() => vNonNegativeInteger("string")).toThrow(new SingleValidationError("non-negative integer", "string"));
        expect(() => vNonNegativeInteger(true)).toThrow(new SingleValidationError("non-negative integer", true));
        expect(() => vNonNegativeInteger(null)).toThrow(new SingleValidationError("non-negative integer", null));
        expect(() => vNonNegativeInteger(undefined)).toThrow(new SingleValidationError("non-negative integer", undefined));
        expect(() => vNonNegativeInteger({})).toThrow(new SingleValidationError("non-negative integer", {}));
        const func = () => {};
        expect(() => vNonNegativeInteger(func)).toThrow(new SingleValidationError("non-negative integer", func));
    });
});

describe("vIntegerBetween", () => {
    test("should exist", () => {
        expect(vIntegerBetween).toBeDefined();
    });

    test("should validate integers between min and max", () => {
        expect(vIntegerBetween(0, 10)(5)).toEqual(5);
        expect(vIntegerBetween(-10, 10)(0)).toEqual(0);
        expect(vIntegerBetween(1e30, 1e32)(1e31)).toEqual(1e31);
    });

    test("should validate integers equal to min", () => {
        expect(vIntegerBetween(0, 10)(0)).toEqual(0);
        expect(vIntegerBetween(-10, 10)(-10)).toEqual(-10);
        expect(vIntegerBetween(1e30, 1e32)(1e30)).toEqual(1e30);
    });

    test("should throw for integers equal to max", () => {
        expect(() => vIntegerBetween(0, 10)(10)).toThrow(new SingleValidationError("integer between 0 and 10", 10));
        expect(() => vIntegerBetween(-10, 10)(10)).toThrow(new SingleValidationError("integer between -10 and 10", 10));
        expect(() => vIntegerBetween(1e30, 1e32)(1e32)).toThrow(new SingleValidationError("integer between 1e+30 and 1e+32", 1e32));
    });

    test("should throw for integers less than min", () => {
        expect(() => vIntegerBetween(0, 10)(-1)).toThrow(new SingleValidationError("integer between 0 and 10", -1));
        expect(() => vIntegerBetween(-10, 10)(-11)).toThrow(new SingleValidationError("integer between -10 and 10", -11));
        expect(() => vIntegerBetween(1e30, 1e32)(1e29)).toThrow(new SingleValidationError("integer between 1e+30 and 1e+32", 1e29));
    });

    test("should throw for integers greater than max", () => {
        expect(() => vIntegerBetween(0, 10)(11)).toThrow(new SingleValidationError("integer between 0 and 10", 11));
        expect(() => vIntegerBetween(1e30, 1e32)(1e33)).toThrow(new SingleValidationError("integer between 1e+30 and 1e+32", 1e33));
    });

    test("should throw for non-integers", () => {
        expect(() => vIntegerBetween(0, 10)(1.5)).toThrow(new SingleValidationError("integer between 0 and 10", 1.5));
        expect(() => vIntegerBetween(0, 10)(4.321)).toThrow(new SingleValidationError("integer between 0 and 10", 4.321));
    });

    test("should throw for non-reals", () => {
        expect(() => vIntegerBetween(0, 10)(Number.POSITIVE_INFINITY)).toThrow(new SingleValidationError("integer between 0 and 10", Number.POSITIVE_INFINITY));
        expect(() => vIntegerBetween(0, 10)(Number.NEGATIVE_INFINITY)).toThrow(new SingleValidationError("integer between 0 and 10", Number.NEGATIVE_INFINITY));
        expect(() => vIntegerBetween(0, 10)(NaN)).toThrow(new SingleValidationError("integer between 0 and 10", NaN));
    });

    test("should throw for non-numbers", () => {
        expect(() => vIntegerBetween(0, 10)("string")).toThrow(new SingleValidationError("integer between 0 and 10", "string"));
        expect(() => vIntegerBetween(0, 10)(true)).toThrow(new SingleValidationError("integer between 0 and 10", true));
        expect(() => vIntegerBetween(0, 10)(null)).toThrow(new SingleValidationError("integer between 0 and 10", null));
        expect(() => vIntegerBetween(0, 10)(undefined)).toThrow(new SingleValidationError("integer between 0 and 10", undefined));
        expect(() => vIntegerBetween(0, 10)({})).toThrow(new SingleValidationError("integer between 0 and 10", {}));
        const func = () => {};
        expect(() => vIntegerBetween(0, 10)(func)).toThrow(new SingleValidationError("integer between 0 and 10", func));
    });
});
