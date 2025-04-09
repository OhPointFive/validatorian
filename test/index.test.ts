import { describe, test, expect } from "vitest";
import { testFunction } from "../src";

describe("index", () => {
    test("should return hello world string", () => {
        expect(testFunction()).toBe("Hello, world!");
    });
});
