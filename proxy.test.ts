import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock, getLocaleMock, redirectMock, nextMock } = vi.hoisted(() => ({
    authMock: vi.fn(),
    getLocaleMock: vi.fn(),
    redirectMock: vi.fn((url: URL | { pathname: string }) => ({
        kind: "redirect",
        url: url instanceof URL ? url.toString() : `https://example.com${url.pathname}`,
    })),
    nextMock: vi.fn(() => ({
        cookies: {
            set: vi.fn(),
        },
    })),
}));

vi.mock("@/lib/auth", () => ({
    auth: authMock,
}));

vi.mock("./lib/utils", () => ({
    getLocale: getLocaleMock,
}));

vi.mock("next/server", () => ({
    NextResponse: {
        redirect: redirectMock,
        next: nextMock,
    },
}));

import { localeMiddleware, proxy } from "./proxy";

function buildRequest(pathname: string, options?: { cookieLocale?: string | null; acceptLanguage?: string }) {
    return {
        url: `https://example.com${pathname}`,
        nextUrl: {
            pathname,
        },
        headers: {
            get: vi.fn((name: string) => {
                if (name === "Accept-Language") return options?.acceptLanguage ?? null;
                return null;
            }),
        },
        cookies: {
            get: vi.fn((name: string) => {
                if (name === "locale" && options?.cookieLocale) {
                    return { value: options.cookieLocale };
                }
                return undefined;
            }),
        },
    };
}

describe("middleware", () => {
    beforeEach(() => {
        authMock.mockReset();
        getLocaleMock.mockReset();
        redirectMock.mockClear();
        nextMock.mockClear();
    });

    it("redirects unauthenticated users on protected localized routes", async () => {
        authMock.mockResolvedValue(null);
        const req = buildRequest("/en/campaigns");

        await proxy(req);

        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect((redirectMock.mock.calls[0][0] as URL).toString()).toBe("https://example.com/en/login");
    });

    it("passes authenticated localized routes through locale middleware", async () => {
        authMock.mockResolvedValue({ user: { email: "player@example.com" } });
        const req = buildRequest("/de/dashboard");

        await proxy(req);

        expect(nextMock).toHaveBeenCalledTimes(1);
        const response = nextMock.mock.results[0]?.value as { cookies: { set: ReturnType<typeof vi.fn> } };
        expect(response.cookies.set).toHaveBeenCalledWith("locale", "de", { path: "/" });
    });
});

describe("localeMiddleware", () => {
    beforeEach(() => {
        getLocaleMock.mockReset();
        redirectMock.mockClear();
        nextMock.mockClear();
    });

    it("sets locale cookie when pathname already contains supported locale", () => {
        const req = buildRequest("/fr/campaigns");

        localeMiddleware(req);

        expect(nextMock).toHaveBeenCalledTimes(1);
        const response = nextMock.mock.results[0]?.value as { cookies: { set: ReturnType<typeof vi.fn> } };
        expect(response.cookies.set).toHaveBeenCalledWith("locale", "fr", { path: "/" });
        expect(redirectMock).not.toHaveBeenCalled();
    });

    it("redirects to cookie locale when pathname has no locale", () => {
        const req = buildRequest("/campaigns", { cookieLocale: "de" });

        localeMiddleware(req);

        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect((redirectMock.mock.calls[0][0] as { pathname: string }).pathname).toBe("/de/campaigns");
        expect(getLocaleMock).not.toHaveBeenCalled();
    });

    it("falls back to Accept-Language locale selection", () => {
        getLocaleMock.mockReturnValue("it");
        const req = buildRequest("/campaigns", {
            cookieLocale: null,
            acceptLanguage: "it-IT,it;q=0.9,en;q=0.8",
        });

        localeMiddleware(req);

        expect(getLocaleMock).toHaveBeenCalledWith("it-IT,it;q=0.9,en;q=0.8", ["en", "de", "fr", "it"]);
        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect((redirectMock.mock.calls[0][0] as { pathname: string }).pathname).toBe("/it/campaigns");
    });
});
