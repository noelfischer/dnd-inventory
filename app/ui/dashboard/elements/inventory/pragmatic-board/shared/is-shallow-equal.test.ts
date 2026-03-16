import { describe, expect, it } from "vitest";

import { isShallowEqual } from "./is-shallow-equal";

describe("isShallowEqual", () => {
    it("returns true for objects with identical keys and values", () => {
        expect(isShallowEqual({ a: 1, b: "x" }, { a: 1, b: "x" })).toBe(true);
    });

    it("returns false when key count differs", () => {
        expect(isShallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it("uses Object.is semantics for value comparison", () => {
        expect(isShallowEqual({ a: Number.NaN }, { a: Number.NaN })).toBe(true);
        expect(isShallowEqual({ a: -0 }, { a: 0 })).toBe(false);
    });

    it("returns false when at least one value differs", () => {
        expect(isShallowEqual({ a: 1, b: true }, { a: 1, b: false })).toBe(false);
    });
});
