import { SingleValidationError } from "../errors/single";
import { transformingValidator, type Validator } from "../validator-helpers/validator";

/**
 * Validates that the passed value is an array,
 * and that each item in the array passes the validator.
 */
export const vArray = <T>(v: Validator<T>) => transformingValidator<T[]>(
    (value: unknown) => {
        if (!Array.isArray(value)) {
            throw new SingleValidationError("array", value);
        }
        return value.map(item => v(item));
    },
);

/**
 * Verifies that the passed value is an array of the specified length,
 * and that each item in the array passes the validator.
 */
export const vArrayOfLength = <T>(v: Validator<T>, length: number) => transformingValidator<T[]>(
    (value: unknown) => {
        if (!Array.isArray(value) || value.length !== length) {
            throw new SingleValidationError(`array of length ${length}`, value);
        }
        return value.map(item => v(item));
    },
);

/**
 * Verifies that the passed value is an array of the specified length,
 * and that each item in the array passes the validator.
 *
 * The start and end values are inclusive.
 */
export const vArrayOfLengthBetween = <T>(v: Validator<T>, minLength: number, maxLength: number) => transformingValidator<T[]>(
    (value: unknown) => {
        if (!Array.isArray(value) || value.length < minLength || value.length > maxLength) {
            throw new SingleValidationError(`array of length [${minLength}, ${maxLength}]`, value);
        }
        return value.map(item => v(item));
    },
);

/**
 * Verifies that the passed value is an array of at least the specified length,
 * and that each item in the array passes the validator.
 *
 * Arrays of length `minLength` are considered valid.
 */
export const vArrayOfAtLeastLength = <T>(v: Validator<T>, minLength: number) => transformingValidator<T[]>(
    (value: unknown) => {
        if (!Array.isArray(value) || value.length < minLength) {
            throw new SingleValidationError(`array of at least length ${minLength}`, value);
        }
        return value.map(item => v(item));
    },
);

/**
 * Verifies that the passed value is an array of at most the specified length,
 * and that each item in the array passes the validator.
 *
 * Arrays of length `maxLength` are considered valid.
 */
export const vArrayOfAtMostLength = <T>(v: Validator<T>, maxLength: number) => transformingValidator<T[]>(
    (value: unknown) => {
        if (!Array.isArray(value) || value.length > maxLength) {
            throw new SingleValidationError(`array of at most length ${maxLength}`, value);
        }
        return value.map(item => v(item));
    },
);

/**
 * Verifies that the passed value is a non-empty array,
 * and that each item in the array passes the validator.
 */
export const vNonemptyArrayOf = <T>(v: Validator<T>) => vArrayOfAtLeastLength(v, 1);
