import { describe, test, expect } from "vitest";
import { SingleValidationError } from "../../src/errors/single";
import { vConst } from "../../src/validators/const";

describe("vConst", () => {
    test("should exist", () => {
        expect(vConst).toBeDefined();
    });

    test("should validate constants", () => {
        expect(vConst("test")("test")).toEqual("test");
        expect(vConst(1)(1)).toEqual(1);
        const symbol = Symbol("test");
        expect(vConst(symbol)(symbol)).toEqual(symbol);
    });
});
