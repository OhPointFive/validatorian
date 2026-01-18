import { SingleValidationError } from "../errors/single";
import { transformingValidator, type Validator } from "../validator-helpers/validator";

/**
 * Validates that the passed value is a tuple matching the specified format.
 *
 * Returns a new array, instead of modifying the passed array in place.
 *
 * If the passed value is too short, any missing items are treated as `undefined`,
 * and will pass validation if the corresponding validator allows `undefined`.
 * If the passed value is too long, any extra items are silent dropped.
 * If you want to require a specific length instead, use `vStrictTuple`.
 */
export const vTuple = <T extends unknown[]>(...validators: { [K in keyof T]: Validator<T[K]> }) => transformingValidator<T>((value: unknown) => {
    if (!Array.isArray(value)) {
        throw new SingleValidationError("tuple", value);
    }
    const result = validators.map((validator, index) => validator(value[index])) as T;
    return result;
});

/**
 * Validates that the passed value is a tuple matching the specified format,
 * and that the tuple has the exact length specified by the number of validators.
 *
 * Returns a new array, instead of modifying the passed array in place.
 *
 * If the passed value is too short, it does not pass validation,
 * even if the missing values would have passed as undefined.
 * If the passed value is too long, it does not pass validation.
 * If you want to be less restrictive, use `vTuple`.
 */
export const vStrictTuple = <T extends unknown[]>(...validators: { [K in keyof T]: Validator<T[K]> }) => transformingValidator<T>((value: unknown) => {
    if (!Array.isArray(value) || value.length !== validators.length) {
        throw new SingleValidationError(`tuple of length ${validators.length}`, value);
    }
    const result = validators.map((validator, index) => validator(value[index])) as T;
    return result;
});
