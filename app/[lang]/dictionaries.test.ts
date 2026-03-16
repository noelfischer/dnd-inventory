import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getDictionary, getDictFromParams, type Locale } from "./dictionaries";

describe("dictionaries", () => {
    it("loads all supported locale dictionaries", async () => {
        const locales: Locale[] = ["en", "de", "fr", "it"];
        const base = await getDictionary("en");
        const baseKeys = Object.keys(base).sort();

        for (const locale of locales) {
            const dictionary = await getDictionary(locale);
            expect(dictionary).toBeTypeOf("object");
            expect(Object.keys(dictionary).length).toBeGreaterThan(0);
            expect(Object.keys(dictionary).sort()).toEqual(baseKeys);
        }
    });

    it("loads dictionary from async route params", async () => {
        const dictionary = await getDictFromParams(Promise.resolve({ lang: "en" }));
        const direct = await getDictionary("en");

        expect(dictionary).toEqual(direct);
    });
});
