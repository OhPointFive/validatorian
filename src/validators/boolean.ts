import { validator } from "../validator-helpers/validator";

/** Validates that the passed value is a boolean */
export const vBoolean = validator(
    "boolean",
    (value: unknown): value is boolean =>
        typeof value === "boolean",
);
