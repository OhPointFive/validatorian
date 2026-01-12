import { SingleValidationError } from "../errors/single";

/**
 * A function that validates the specified value,
 * and throws a `ValidationError` if the value is invalid.
 *
 * It may construct a new object of type `T`
 * or return the value passed in,
 * depending on the specific Validator.
 *
 * To easily cast a function to a Validator, use the `validator` function.
 */
export type Validator<T> = (value: unknown) => T;

/**
 * What the return type of a `Validator` is.
 */
export type ValidatedBy<T extends Validator<unknown>> = ReturnType<T>;

/**
 * Casts the passed parameter to a `Validator`.
 *
 * This just returns the value passed in,
 * but saves having to write an explicity type annotation
 * to tell TypeScript it's a `Validator`.
 */
export function validator<T>(v: Validator<T>): Validator<T> {
    return v;
}

/**
 * Creates a `Validator` for a particular type,
 * returning it if the passed function returns true
 * or throwing a `ValidationError` if it returns false.
 *
 * @param typeName The type name to output in errors when the value is invalid.
 */
export function booleanValidator<T>(typeName: string, v: (value: unknown) => value is T): Validator<T> {
    return (value: unknown) => {
        if (!v(value)) {
            throw new SingleValidationError(typeName, value);
        }
        return value;
    };
}
