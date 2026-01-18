import { ValidationError } from "../errors/abstract";
import { validator, type Validator } from "../validator-helpers/validator";

/**
 * Replaces null and undefined values with the specified default,
 * and validates all other values with the validator.
 *
 * If a function is passed as the default value,
 * it's called with no arguments to generate the default value.
 * If you want the default value to be a function, pass a function that returns a function.
 *
 * If you want to use the default value for any type that doesn't pass validation,
 * use `vWithFallback` instead.
 */
export const vWithDefault = <T, U>(v: Validator<T>, defaultValue: U | (() => U)) => validator<T | U>((value: unknown) => {
    if (value === null || value === undefined) {
        // Type casting is ok here.
        // If the user passes something that's typeof is a function, but isn't callable,
        // that's a strange thing they've done and they'll get a fairly clear error.
        return typeof defaultValue === "function" ? (defaultValue as () => T)() : defaultValue;
    }
    return v(value);
});

/**
 * Validates the passed value with the validator,
 * and returns the fallback if it fails validation.
 *
 * If a function is passed as the fallback value,
 * it's called with the original value as an argument.
 *
 * If you only want to use the fallback for `null` or `undefined`,
 * use `vWithDefault` instead.
 */
export const vWithFallback = <T, U>(v: Validator<T>, fallback: U | ((originalValue: unknown) => U)) => validator<T | U>((value: unknown) => {
    try {
        return v(value);
    } catch (error) {
        if (error instanceof ValidationError) {
            // Type casting is ok here.
            // If the user passes something that's typeof is a function, but isn't callable,
            // that's a strange thing they've done and they'll get a fairly clear error.
            return typeof fallback === "function" ? (fallback as (originalValue: unknown) => U)(value) : fallback;
        }
        throw error;
    }
});
