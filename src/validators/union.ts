import { ValidationError } from "../errors/abstract";
import { UnionValidationError } from "../errors/union";
import { validator, type Validator } from "../validator-helpers/validator";

/**
 * Validates that the passed value fits one of the specified validators.
 *
 * Returns the value returned by the first passing validator.
 *
 * This is used to validate values that can be one of two types, e.g.
 * ```ts
 * const vNumberOrString = vUnion(vNumber, vString);
 * const result1: number | string = vNumberOrString(1);
 * const result2: number | string = vNumberOrString("test");
 * ```
 */
export const vUnion = <T>(...validators: Validator<T>[]) => validator<T>(
    (value: unknown) => {
        const errors: ValidationError[] = [];
        for (const validator of validators) {
            try {
                return validator(value);
            } catch (error) {
                if (error instanceof ValidationError) {
                    errors.push(error);
                    continue;
                }
                throw error;
            }
        }
        throw new UnionValidationError(errors, value);
    },
);
