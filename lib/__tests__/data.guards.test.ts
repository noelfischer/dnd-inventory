import { beforeEach, describe, expect, it, vi } from "vitest";

const {
    authMock,
    redirectMock,
    userFindUniqueMock,
    campaignFindUniqueMock,
    characterFindUniqueMock,
    currencyFindFirstMock,
    dashboardFindUniqueMock,
    dashboardFindFirstMock,
} = vi.hoisted(() => ({
    authMock: vi.fn(),
    redirectMock: vi.fn(() => {
        throw new Error("redirected");
    }),
    userFindUniqueMock: vi.fn(),
    campaignFindUniqueMock: vi.fn(),
    characterFindUniqueMock: vi.fn(),
    currencyFindFirstMock: vi.fn(),
    dashboardFindUniqueMock: vi.fn(),
    dashboardFindFirstMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
    auth: authMock,
}));

vi.mock("next/navigation", () => ({
    redirect: redirectMock,
}));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        user: {
            findUnique: userFindUniqueMock,
        },
        campaign: {
            findUnique: campaignFindUniqueMock,
        },
        character: {
            findUnique: characterFindUniqueMock,
        },
        currency: {
            findFirst: currencyFindFirstMock,
        },
        dashboard: {
            findUnique: dashboardFindUniqueMock,
            findFirst: dashboardFindFirstMock,
        },
    },
}));

import {
    fetchCampaign,
    fetchCampaignIDByDashboard,
    fetchCharacter,
    fetchCharacterByDashboard,
    fetchCurrencyByCharacter,
    fetchUID,
    fetchUsernameFromSession,
    getEmailFromSession,
} from "../data";

describe("data guard branches", () => {
    beforeEach(() => {
        authMock.mockReset();
        redirectMock.mockClear();
        userFindUniqueMock.mockReset();
        campaignFindUniqueMock.mockReset();
        characterFindUniqueMock.mockReset();
        currencyFindFirstMock.mockReset();
        dashboardFindUniqueMock.mockReset();
        dashboardFindFirstMock.mockReset();
    });

    it("getEmailFromSession redirects if auth is missing", async () => {
        authMock.mockResolvedValue(null);

        await expect(getEmailFromSession()).rejects.toThrow("redirected");
        expect(redirectMock).toHaveBeenCalledWith("/login");
    });

    it("getEmailFromSession throws if session email is missing", async () => {
        authMock.mockResolvedValue({ user: {} });

        await expect(getEmailFromSession()).rejects.toThrow("No email in session");
    });

    it("fetchUID throws when user lookup fails", async () => {
        authMock.mockResolvedValue({ user: { email: "player@example.com" } });
        userFindUniqueMock.mockResolvedValue(null);

        await expect(fetchUID()).rejects.toThrow("User not found");
    });

    it("fetchUsernameFromSession throws when user lookup fails", async () => {
        authMock.mockResolvedValue({ user: { email: "player@example.com" } });
        userFindUniqueMock.mockResolvedValue(null);

        await expect(fetchUsernameFromSession()).rejects.toThrow("User not found");
    });

    it("fetchCampaign throws when campaign is missing", async () => {
        campaignFindUniqueMock.mockResolvedValue(null);

        await expect(fetchCampaign("camp-1")).rejects.toThrow("Campaign not found");
    });

    it("fetchCharacter throws when character is missing", async () => {
        characterFindUniqueMock.mockResolvedValue(null);

        await expect(fetchCharacter("char-1")).rejects.toThrow("Character not found");
    });

    it("fetchCurrencyByCharacter throws when currency is missing", async () => {
        currencyFindFirstMock.mockResolvedValue(null);

        await expect(fetchCurrencyByCharacter("char-1")).rejects.toThrow("Currency not found");
    });

    it("fetchCampaignIDByDashboard throws when dashboard is missing", async () => {
        dashboardFindUniqueMock.mockResolvedValue(null);

        await expect(fetchCampaignIDByDashboard("dash-1")).rejects.toThrow("Dashboard not found");
    });

    it("fetchCharacterByDashboard returns null when character relation is missing", async () => {
        dashboardFindFirstMock.mockResolvedValue({ Character: null });

        await expect(fetchCharacterByDashboard("dash-1")).resolves.toBeNull();
    });
});
