/**
 * Represents a failure to validate a specified value.
 *
 * Errors throw by validatorian are always subtypes of ValidationError.
 */
export abstract class ValidationError extends Error {
    public abstract withExtendedPath(extendWith: string): ValidationError;
}

/**
 * Paths to values are represented via arrays,
 * since strings can contain things like `.` and `[]`,
 * and Symbols don't necessarily have a clear string representation.
 *
 * Readable strings instead can be found in the `.pathString()` method,
 * or by using the `pathArrayToString()` function.
 */
export type PathArray = (string | number | symbol)[];

/** Replaces common strange characters with escaped versions. */
function escapeString(key: string): string {
    return key
        .replace(/\\/g, "\\\\")
        .replace(/"/g, "\\\"")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t");
}

/**
 * Converts a path array to a readable string.
 *
 * Separate from the Error classes since it needs to be used
 * in the constructor before the call to super.
 * Prefer to use the `.pathString()` method of the error classes.
 */
export function pathArrayToString(path: (string | number | symbol)[]): string {
    return path.map(p => {
        // If a symbol, for some reason, is wrapped in an object, the typeof check fails.
        // If a symbol is not wrapped in an object, the instanceof check fails.
        // Both of these are typed as `symbol` in TypeScript, so we need to check both.
        // Casting to `any` because TypeScript seems confused about how it works.
        // Consider `typeof Object(Symbol()) === "symbol"` and `Symbol() instanceof Symbol`
        if (typeof p === "symbol" || (p as unknown as object) instanceof Symbol) {
            const description = (p as symbol).description;
            return `[Symbol(${description ? `"${escapeString(description)}"` : ""})]`;
        }

        if (typeof p === "number") {
            return `[${p}]`;
        }

        const escaped = escapeString(p);

        if (escaped !== p || p.includes(" ") || p.includes(".")) {
            return `["${escaped}"]`;
        }

        return `.${p}`;
    }).join("");
}
