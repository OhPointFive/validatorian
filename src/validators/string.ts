import { booleanValidator } from "../validator-helpers/validator";

/** Validates that the passed value is a string. */
export const vString = booleanValidator(
    "string",
    (value: unknown): value is string =>
        typeof value === "string",
);

/** Validates that the passed value is a non-empty string. */
export const vNonEmptyString = booleanValidator(
    "non-empty string",
    (value: unknown): value is string =>
        typeof value === "string" && value.length > 0,
);

/**
 * Validates that the passed value is a string
 * with a length between `minLength` and `maxLength` inclusive.
 *
 * If only one length is specified,
 * it will validate that the string is exactly that length.
 *
 * Validates using javascript's .length property,
 * which may be larger than you expect for e.g. emoji.
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length
 * for details.
 */
export const vStringOfLength = (minLength: number, maxLength: number = minLength) => booleanValidator(
    minLength === maxLength ? `string of length ${minLength}` : `string of length [${minLength}, ${maxLength}]`,
    (value: unknown): value is string =>
        typeof value === "string" && value.length >= minLength && value.length <= maxLength,
);
