import { validator } from "../validator-helpers/validator";

/**
 * Validates that the passed value is a number.
 * Excludes `bigint`s.
 *
 * Consider `vRealNumber` to exclude NaN, -Infinity and Infinity.
 */
export const vNumber = validator(
    "number",
    (value: unknown): value is number =>
        typeof value === "number",
);

/**
 * Validates that the passed value is real number,
 * i.e. a number that is not NaN, -Infinity or Infinity.
 */
export const vRealNumber = validator(
    "real number",
    (value: unknown): value is number =>
        typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value),
);

/**
 * Validates that the passed value is a real number within the range `[min, max)`.
 */
export const vNumberBetween = (min: number, max: number) => validator(
    `number between ${min} and ${max}`,
    (value: unknown): value is number =>
        typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value) && value >= min && value < max,
);

/**
 * Validates that the passed value is an integer
 * in [`Number.MIN_SAFE_INTEGER`, `Number.MAX_SAFE_INTEGER`].
 *
 * Integers outside these bounds may only be integers due to
 * rounding in floating point.
 * If you want to allow these, use `vAnyInteger` instead.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger
 */
export const vInteger = validator(
    "integer",
    (value: unknown): value is number =>
        typeof value === "number" && Number.isSafeInteger(value),
);

/**
 * Validates that the passed value is an integer,
 * even if it's outside `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]`.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger
 */
export const vAnyInteger = validator(
    "any integer",
    (value: unknown): value is number =>
        typeof value === "number" && Number.isInteger(value),
);

/**
 * Validates that the passed value is a natural number,
 * i.e. an integer in [1, Number.MAX_SAFE_INTEGER].
 */
export const vNaturalNumber = validator(
    "natural number",
    (value: unknown): value is number =>
        typeof value === "number" && Number.isSafeInteger(value) && value > 0,
);

/**
 * Validates that the passed value is a non-negative integer,
 * i.e. an integer in [0, Number.MAX_SAFE_INTEGER].
 */
export const vNonNegativeInteger = validator(
    "non-negative integer",
    (value: unknown): value is number =>
        typeof value === "number" && Number.isSafeInteger(value) && value >= 0,
);

/**
 * Validates that the passed value is an integer in the range `[min, max)`.
 *
 * Allows unsafe integers if the min or max is outside the safe integer range.
 */
export const vIntegerBetween = (min: number, max: number) => validator(
    `integer between ${min} and ${max}`,
    (value: unknown): value is number =>
        typeof value === "number" && Number.isInteger(value) && value >= min && value < max,
);
