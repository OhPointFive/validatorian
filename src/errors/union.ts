import { pathArrayToString, ValidationError, type PathArray } from "./abstract";
import { SingleValidationError } from "./single";

function indent(text: string): string {
    return text.split("\n").map(line => `  ${line}`).join("\n");
}

/**
 * Represents a failure to validate something that is allowed to be one of multiple types.
 */
export class UnionValidationError extends ValidationError {
    public constructor(
        /** The original errors from each of the individual validators. */
        public readonly errors: ValidationError[],
        /** The actual value that was found. */
        public readonly value: unknown,
        /** A path array of where the incorrect value was found. Use `.pathString()` for a readable string path. */
        public readonly path?: PathArray | undefined,
    ) {
        let message;
        const combinedErrors = errors.map(e => indent(e.message)).join("\n");
        const types = errors.map(e => e instanceof SingleValidationError ? e.expectedType : undefined).filter(type => type !== undefined);
        const shortTypes = types.length === combinedErrors.length ? types.join(", ") : "multiple types";
        if (path) {
            message = `Expected one of ${shortTypes} at ${pathArrayToString(path)} but got an error for every option:\n${combinedErrors}`;
        } else {
            message = `Expected one of ${shortTypes} but got an error for every option:\n${combinedErrors}`;
        }
        super(
            message,
        );
    }

    /**
     * Returns a new error, with the path extended by the given component.
     *
     * Path extensions are put at the _start_ of the path,
     * so a path like `.key` would become `.key2.key`.
     */
    public override withExtendedPath(pathComponent: PathArray[number]): UnionValidationError {
        return new UnionValidationError(this.errors.map(e => e.withExtendedPath(pathComponent)), this.value, this.path ? [pathComponent, ...this.path] : [pathComponent]);
    }

    /**
     * A readable string describing the path to the value that failed validation.
     */
    public pathString(): string {
        return this.path ? pathArrayToString(this.path) : "";
    }
}
