import { describe, test, expect } from "vitest";
import { validator, transformingValidator, Validator } from "../../src/validator-helpers/validator";
import { SingleValidationError } from "../../src/errors/single";

describe("Validator", () => {
    test("should pass type checking", () => {
        // Expect to pass type checking
        const vString: Validator<string> = (value: unknown): string => {
            if (typeof value !== "string") {
                throw new SingleValidationError("string", value);
            }
            return value;
        };

        const string: string = vString("string" as unknown);

        expect(() => {
            const string: string = vString(1 as unknown);
        }).toThrow(new SingleValidationError("string", 1));
    });
});

describe("validator", () => {
    test("should exist", () => {
        expect(transformingValidator).toBeDefined();
    });

    test("should allow validators to pass through", () => {
        const vString: Validator<string> = transformingValidator((value: unknown): string => {
            if (typeof value !== "string") {
                throw new SingleValidationError("string", value);
            }
            return value;
        });

        const string: string = vString("string" as unknown);

        expect(() => {
            const string: string = vString(1 as unknown);
        }).toThrow(new SingleValidationError("string", 1));
    });
});

describe("booleanValidator", () => {
    test("should exist", () => {
        expect(validator).toBeDefined();
    });

    test("should allow the creation of string validators", () => {
        const vString: Validator<string> = validator("string", (value: unknown): value is string => typeof value === "string");

        const string: string = vString("test" as unknown);

        expect(() => {
            const string: string = vString(1 as unknown);
        }).toThrow(new SingleValidationError("string", 1));
    });

    test("should allow the creation of even validators", () => {
        const vEven: Validator<number> = validator("even integer", (value: unknown): value is number => typeof value === "number" && value === Math.floor(value) && value % 2 === 0);

        const even: number = vEven(2 as unknown);

        expect(() => {
            const even: number = vEven(3 as unknown);
        }).toThrow(new SingleValidationError("even integer", 3));
    });
});
