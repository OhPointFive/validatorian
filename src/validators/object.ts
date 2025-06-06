import { SingleValidationError } from "../errors/single";
import { Validator, validator } from "../validator-helpers/validator";

/**
 * The type of the template to be passed to `vObject`,
 * to validate an object of type `T`.
 */
type ObjectValidatorTemplate<T extends object> = {
    // Marked as readonly to prevent readonly from passing on to the output,
    // and we don't modify it anyway so it's accurate.
    readonly [key in keyof T]: Validator<T[key]>;
};

/**
 * Validates that the passed value is an object matching the
 * specified format.
 *
 * This will accept arrays, Regexes, and other object-like values,
 * so long as they have the correct keys and otherwise pass validation,
 * but will return an Object instead of whatever the original value was.
 *
 * Returns a new object, instead of modifying the passed object in place.
 *
 * Any keys not included in the template are silently dropped from the copy.
 *
 * Any keys in the template missing from the passed value are treated as `undefined`,
 * and are included in the copy with a value of `undefined`, if that is an acceptable value for that key.
 *
 * For example:
 * ```ts
 * const vTest = vObject({
 *    number: optional(vNumber),
 * });
 *
 * const result = vTest({
 *    otherNumber: 2,
 * });
 *
 * // result will be { number: undefined }
 */
export const vObject = <const T extends object>(
    // `template` is marked as readonly, to prevent readonly from passing on to the output,
    // and we don't modify it anyway so it's accurate.
    template: ObjectValidatorTemplate<T>,
) => validator<T>(
    (value: unknown) => {
        if (typeof value !== "object" || value === null) {
            throw new SingleValidationError("object", value);
        }

        // We have to do a lot of casting here,
        // since TypeScript doesn't doesn't narrow to record types,
        // and doesn't support building a Record gradually.
        const valueRecord = value as Record<string | number | symbol, unknown>;
        const output = {} as Record<string | number | symbol, unknown>;

        // Object.keys excludes symbols.
        // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys#description
        for (const key of Reflect.ownKeys(template)) {
            try {
                output[key] = (template[key as keyof typeof template] as Validator<unknown>)(valueRecord[key]);
            } catch (error) {
                if (error instanceof SingleValidationError) {
                    // This might coerce numeric keys to strings,
                    // but objects do that anyway so it's fine.
                    throw error.withExtendedPath(key);
                } else {
                    throw error; // Re-throw any other errors.
                }
            }
        }

        return output as T;
    },
);
