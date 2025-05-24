import { booleanValidator } from "../validator-helpers/validator";

/**
 * Validates that the passed value is strictly equal to the specified value.
 *
 * For example, `vConst("Example")` will make a validator
 * that only accepts the string `"Example"`.
 */
export const vConst = <const T>(value: T) => booleanValidator(`exact ${typeof value} \`${String(value)}\``, (v: unknown): v is T => v === value);
