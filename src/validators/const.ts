import { booleanValidator } from "../validator-helpers/validator";

function exactNameOfValue(value: unknown): string {
    if (value === null) {
        return "null";
    }

    if (value === undefined) {
        return "undefined";
    }

    return `exact ${typeof value} \`${String(value as unknown)}\``;
}

/**
 * Validates that the passed value is strictly equal to the specified value.
 *
 * For example, `vConst("Example")` will make a validator
 * that only accepts the string `"Example"`.
 */
export const vConst = <const T>(value: T) => booleanValidator(
    exactNameOfValue(value),
    (v: unknown): v is T =>
        v === value
        // We want to be able to validate NaN, but for some reason NaN !== NaN
        || (Number.isNaN(v) && Number.isNaN(value)),
);

/**
 * Validates that the passed value is exactly `null`.
 */
export const vNull = vConst(null);
/**
 * Validates that the passed value is exactly `undefined`.
 */
export const vUndefined = vConst(undefined);
/**
 * Validates that the passed value is exactly `true`.
 */
export const vTrue = vConst(true);
/**
 * Validates that the passed value is exactly `false`.
 */
export const vFalse = vConst(false);
