import { booleanValidator } from "../validator-helpers/validator";

/** Validates that the passed value is a boolean */
export const vBoolean = booleanValidator(
    "boolean",
    (value: unknown): value is boolean =>
        typeof value === "boolean",
);
