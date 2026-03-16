import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../prisma", () => ({
    prisma: {
        user: {
            findFirst: vi.fn(),
        },
    },
}));

import {
    formatCurrency,
    formatDateToLocal,
    getClasses,
    getLocale,
    handleFileUpload,
} from "../utils";

class FileReaderMock {
    public onload: ((event: { target: { result: string } }) => void) | null = null;
    public onerror: (() => void) | null = null;

    readAsText(file: { text: () => Promise<string> }) {
        file
            .text()
            .then((content) => {
                this.onload?.({ target: { result: content } });
            })
            .catch(() => {
                this.onerror?.();
            });
    }
}

describe("utils", () => {
    beforeEach(() => {
        vi.stubGlobal("FileReader", FileReaderMock as unknown as typeof FileReader);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("returns locale-specific classes sorted by value", () => {
        const classesEn = getClasses("en");
        const values = classesEn.map((entry) => entry.value);
        const sorted = [...values].sort((a, b) => a.localeCompare(b));

        expect(classesEn).toHaveLength(14);
        expect(values).toEqual(sorted);
        expect(classesEn.some((entry) => entry.value === "Wizard")).toBe(true);
    });

    it("formats currency from cents", () => {
        expect(formatCurrency(12345)).toBe("$123.45");
        expect(formatCurrency(-199)).toBe("-$1.99");
    });

    it("formats date according to locale", () => {
        expect(formatDateToLocal("2026-03-16T00:00:00.000Z", "en-US")).toBe("Mar 16, 2026");
        expect(formatDateToLocal("2026-03-16T00:00:00.000Z", "de-DE")).toBe("16. März 2026");
    });

    it("parses uploaded json files", async () => {
        const file = {
            text: async () => JSON.stringify({ name: "Aria", level: 4 }),
        } as unknown as File;

        await expect(handleFileUpload(file)).resolves.toEqual({ name: "Aria", level: 4 });
    });

    it("rejects invalid json uploads", async () => {
        const file = {
            text: async () => "not-json",
        } as unknown as File;

        await expect(handleFileUpload(file)).rejects.toBe("Invalid JSON file");
    });

    it("rejects when file reader fails", async () => {
        const file = {
            text: async () => {
                throw new Error("read failed");
            },
        } as unknown as File;

        await expect(handleFileUpload(file)).rejects.toBe("Error reading file");
    });

    it("selects best locale from accept-language header", () => {
        expect(getLocale("fr-CH,fr;q=0.9,en;q=0.8", ["en", "de", "fr", "it"]))
            .toBe("fr");
        expect(getLocale(undefined, ["en", "de"])).toBe("en");
    });
});
