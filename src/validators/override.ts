import { validator } from "../validator-helpers/validator";

/**
 * Ignores the value to validate, and returns the specified override value.
 *
 * If a function is passed as the override value,
 * it's called with the original value as an argument.
 * If you want the default value to be a function,
 * pass a function that returns a function.
 */
export const vOverride = <T>(override: T | ((originalValue: unknown) => T)) => validator<T>((value: unknown) => {
    if (typeof override === "function") {
        // Type casting is ok here.
        // If the user passes something that's typeof is a function, but isn't callable,
        // that's a strange thing they've done and they'll get a fairly clear error.
        return (override as (originalValue: unknown) => T)(value);
    }
    return override;
});
