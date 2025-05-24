import { PathArray, pathArrayToString, ValidationError } from "./abstract";

/**
 * Represents a failure to validate, where only one type was expected.
 */
export class SingleValidationError extends ValidationError {
    public constructor(
        /** A string description of what type is expected. */
        public readonly expectedType: string,
        /** The actual value that was found. */
        public readonly actualValue: unknown,
        /** A path array of where the incorrect value was found. Use `.pathString()` for a readable string path. */
        public readonly path?: PathArray | undefined,
    ) {
        let message;
        if (path) {
            message = `Expected ${expectedType} but got ${String(actualValue)} at ${pathArrayToString(path)}`;
        } else {
            message = `Expected ${expectedType} but got ${String(actualValue)}`;
        }
        super(message);
    }

    /**
     * Returns a new error, with the path extended by the given component.
     *
     * Path extensions are put at the _start_ of the path,
     * so a path like `.key` would become `.key2.key`.
     */
    public withExtendedPath(pathComponent: PathArray[number]): SingleValidationError {
        return new SingleValidationError(this.expectedType, this.actualValue, this.path ? [pathComponent, ...this.path] : [pathComponent]);
    }

    /**
     * A readable string describing the path to the value that failed validation.
     */
    public pathString(): string {
        return this.path ? pathArrayToString(this.path) : "";
    }
}
