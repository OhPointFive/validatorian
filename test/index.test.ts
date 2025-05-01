import { describe, test, expect } from "vitest";
import { testFunction } from "../src";

describe("index", () => {
    test("should return hello world string", () => {
        expect(testFunction()).toEqual("Hello, world!");
    });
});
