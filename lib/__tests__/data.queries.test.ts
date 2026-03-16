import { beforeEach, describe, expect, it, vi } from "vitest";

const {
    authMock,
    redirectMock,
    campaignUserFindManyMock,
    campaignUserCountMock,
    characterCountMock,
    userFindUniqueMock,
    campaignFindManyMock,
    characterFindManyMock,
    inventoryFindManyMock,
    dashboardFindManyMock,
    dashboardElementFindManyMock,
    dashboardCountMock,
} = vi.hoisted(() => ({
    authMock: vi.fn(),
    redirectMock: vi.fn(),
    campaignUserFindManyMock: vi.fn(),
    campaignUserCountMock: vi.fn(),
    characterCountMock: vi.fn(),
    userFindUniqueMock: vi.fn(),
    campaignFindManyMock: vi.fn(),
    characterFindManyMock: vi.fn(),
    inventoryFindManyMock: vi.fn(),
    dashboardFindManyMock: vi.fn(),
    dashboardElementFindManyMock: vi.fn(),
    dashboardCountMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
    auth: authMock,
}));

vi.mock("next/navigation", () => ({
    redirect: redirectMock,
}));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        campaignUser: {
            findMany: campaignUserFindManyMock,
            count: campaignUserCountMock,
        },
        character: {
            count: characterCountMock,
            findMany: characterFindManyMock,
        },
        user: {
            findUnique: userFindUniqueMock,
        },
        campaign: {
            findMany: campaignFindManyMock,
        },
        inventoryItem: {
            findMany: inventoryFindManyMock,
        },
        dashboard: {
            findMany: dashboardFindManyMock,
            count: dashboardCountMock,
        },
        dashboardElement: {
            findMany: dashboardElementFindManyMock,
        },
    },
}));

import {
    fetchCampaigns,
    fetchCampaignUsers,
    fetchCharactersByCampaign,
    fetchCharactersByCampaignAndUser,
    fetchDashboardElementsByDashboard,
    fetchDashboardNumber,
    fetchDashboardsByCampaign,
    fetchInventoryByCharacter,
    fetchUserAndCharacterCount,
    fetchUsername,
    fetchUsersByCampaign,
} from "../data";

describe("data query contracts", () => {
    beforeEach(() => {
        authMock.mockReset();
        redirectMock.mockReset();
        campaignUserFindManyMock.mockReset();
        campaignUserCountMock.mockReset();
        characterCountMock.mockReset();
        userFindUniqueMock.mockReset();
        campaignFindManyMock.mockReset();
        characterFindManyMock.mockReset();
        inventoryFindManyMock.mockReset();
        dashboardFindManyMock.mockReset();
        dashboardElementFindManyMock.mockReset();
        dashboardCountMock.mockReset();
    });

    it("fetchUsersByCampaign returns users and queries by campaign id", async () => {
        campaignUserFindManyMock.mockResolvedValue([{ campaign_user_id: "cu-1" }]);

        const result = await fetchUsersByCampaign("camp-1");

        expect(campaignUserFindManyMock).toHaveBeenCalledWith({
            where: { campaign_id: "camp-1" },
            include: {
                User: { select: { username: true } },
            },
        });
        expect(result).toEqual([{ campaign_user_id: "cu-1" }]);
    });

    it("fetchUserAndCharacterCount combines count calls", async () => {
        campaignUserCountMock.mockResolvedValue(4);
        characterCountMock.mockResolvedValue(9);

        const result = await fetchUserAndCharacterCount();

        expect(result).toEqual({ userCount: 4, characterCount: 9 });
    });

    it("fetchUsername returns username from user id lookup", async () => {
        userFindUniqueMock.mockResolvedValue({ username: "Aria" });

        const result = await fetchUsername("user-1");

        expect(userFindUniqueMock).toHaveBeenCalledWith({
            select: { username: true },
            where: { user_id: "user-1" },
        });
        expect(result).toBe("Aria");
    });

    it("fetchCampaigns filters by campaign membership", async () => {
        campaignFindManyMock.mockResolvedValue([{ campaign_id: "camp-1" }]);

        const result = await fetchCampaigns("user-1");

        expect(campaignFindManyMock).toHaveBeenCalledWith({
            where: { CampaignUser: { some: { user_id: "user-1" } } },
        });
        expect(result).toEqual([{ campaign_id: "camp-1" }]);
    });

    it("fetchCampaignUsers returns included user information", async () => {
        campaignUserFindManyMock.mockResolvedValue([{ campaign_user_id: "cu-1" }]);

        const result = await fetchCampaignUsers("camp-1");

        expect(campaignUserFindManyMock).toHaveBeenCalledWith({
            where: { campaign_id: "camp-1" },
            include: { User: { select: { username: true } } },
        });
        expect(result).toEqual([{ campaign_user_id: "cu-1" }]);
    });

    it("fetchCharactersByCampaign and by user call expected filters", async () => {
        characterFindManyMock.mockResolvedValue([{ character_id: "char-1" }]);

        const byCampaign = await fetchCharactersByCampaign("camp-1");
        const byCampaignAndUser = await fetchCharactersByCampaignAndUser("camp-1", "user-1");

        expect(characterFindManyMock).toHaveBeenNthCalledWith(1, {
            where: { campaign_id: "camp-1" },
            select: { character_id: true, name: true, current_hit_points: true, max_hit_points: true, character_type: true },
        });
        expect(characterFindManyMock).toHaveBeenNthCalledWith(2, {
            where: { campaign_id: "camp-1", user_id: "user-1" },
            select: { character_id: true, name: true, current_hit_points: true, max_hit_points: true, character_type: true },
        });
        expect(byCampaign).toEqual([{ character_id: "char-1" }]);
        expect(byCampaignAndUser).toEqual([{ character_id: "char-1" }]);
    });

    it("fetchInventoryByCharacter and fetchDashboardsByCampaign use direct where filters", async () => {
        inventoryFindManyMock.mockResolvedValue([{ item_id: "it-1" }]);
        dashboardFindManyMock.mockResolvedValue([{ dashboard_id: "dash-1" }]);

        const inventory = await fetchInventoryByCharacter("char-1");
        const dashboards = await fetchDashboardsByCampaign("camp-1");

        expect(inventoryFindManyMock).toHaveBeenCalledWith({ where: { character_id: "char-1" } });
        expect(dashboardFindManyMock).toHaveBeenCalledWith({ where: { campaign_id: "camp-1" } });
        expect(inventory).toEqual([{ item_id: "it-1" }]);
        expect(dashboards).toEqual([{ dashboard_id: "dash-1" }]);
    });

    it("fetchDashboardElementsByDashboard filters by dashboard id", async () => {
        dashboardElementFindManyMock.mockResolvedValue([{ element_id: "el-1" }]);

        const result = await fetchDashboardElementsByDashboard("dash-1");

        expect(dashboardElementFindManyMock).toHaveBeenCalledWith({ where: { dashboard_id: "dash-1" } });
        expect(result).toEqual([{ element_id: "el-1" }]);
    });

    it("fetchDashboardNumber passes undefined character when null is provided", async () => {
        dashboardCountMock.mockResolvedValue(3);

        const result = await fetchDashboardNumber("camp-1", null);

        expect(dashboardCountMock).toHaveBeenCalledWith({
            where: { campaign_id: "camp-1", character_id: undefined },
        });
        expect(result).toBe(3);
    });

    it("fetchDashboardNumber passes character id when provided", async () => {
        dashboardCountMock.mockResolvedValue(2);

        const result = await fetchDashboardNumber("camp-1", "char-1");

        expect(dashboardCountMock).toHaveBeenCalledWith({
            where: { campaign_id: "camp-1", character_id: "char-1" },
        });
        expect(result).toBe(2);
    });
});
