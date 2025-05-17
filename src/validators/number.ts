import { booleanValidator } from "../validator-helpers/validator";

/**
 * Validates that the passed value is a number.
 * Excludes `bigint`s.
 *
 * Consider `vRealNumber` to exclude NaN, -Infinity and Infinity.
 */
export const vNumber = booleanValidator(
    "number",
    (value: unknown): value is number =>
        typeof value === "number",
);

/**
 * Validates that the passed value is real number,
 * i.e. a number that is not NaN, -Infinity or Infinity.
 */
export const vRealNumber = booleanValidator(
    "real number",
    (value: unknown): value is number =>
        typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value),
);

/**
 * Validates that the passed value is a real number within the range `[min, max)`.
 */
export const vNumberBetween = (min: number, max: number) => booleanValidator(
    `number between ${min} and ${max}`,
    (value: unknown): value is number =>
        typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value) && value >= min && value < max,
);

/**
 * Validates that the passed value is a safe integer.
 *
 * Rejects integers that are outside the bounds of exact representation,
 * and instead are just floating point numbers too large to have a fractional part.
 *
 * If you want to allow these, use `vAnyInteger` instead.
 */
export const vInteger = booleanValidator(
    "integer",
    (value: unknown): value is number =>
        typeof value === "number" && Number.isSafeInteger(value),
);

/**
 * Validates that the passed value is an integer,
 * even if it's outside `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 *
 * These numbers are represented in floating point,
 * but too large to have a fractional part.
 */
export const vAnyInteger = booleanValidator(
    "any integer",
    (value: unknown): value is number =>
        typeof value === "number" && Number.isInteger(value),
);

/**
 * Validates that the passed value is a natural number,
 * i.e. an integer in [1, Number.MAX_SAFE_INTEGER].
 */
export const vNaturalNumber = booleanValidator(
    "natural number",
    (value: unknown): value is number =>
        typeof value === "number" && Number.isSafeInteger(value) && value > 0,
);

/**
 * Validates that the passed value is a non-negative integer,
 * i.e. an integer in [0, Number.MAX_SAFE_INTEGER].
 */
export const vNonNegativeInteger = booleanValidator(
    "non-negative integer",
    (value: unknown): value is number =>
        typeof value === "number" && Number.isSafeInteger(value) && value >= 0,
);
