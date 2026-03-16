import { beforeEach, describe, expect, it, vi } from "vitest";

const {
    revalidatePathMock,
    redirectMock,
    signInMock,
    nanoidMock,
    fetchUIDMock,
    userDeleteMock,
    campaignFindUniqueMock,
    characterUpdateMock,
    characterDeleteMock,
    characterCreateMock,
    dashboardDeleteMock,
} = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    redirectMock: vi.fn(),
    signInMock: vi.fn(),
    nanoidMock: vi.fn(),
    fetchUIDMock: vi.fn(),
    userDeleteMock: vi.fn(),
    campaignFindUniqueMock: vi.fn(),
    characterUpdateMock: vi.fn(),
    characterDeleteMock: vi.fn(),
    characterCreateMock: vi.fn(),
    dashboardDeleteMock: vi.fn(),
}));

vi.mock("next/cache", () => ({
    revalidatePath: (...args: unknown[]) => revalidatePathMock(...args),
}));

vi.mock("next/navigation", () => ({
    redirect: (...args: unknown[]) => redirectMock(...args),
}));

vi.mock("next-auth", () => ({
    AuthError: class AuthError extends Error {
        type: string;

        constructor(type: string) {
            super(type);
            this.type = type;
        }
    },
}));

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
}));

vi.mock("nanoid", () => ({
    nanoid: (...args: unknown[]) => nanoidMock(...args),
}));

vi.mock("@/lib/auth", () => ({
    signIn: (...args: unknown[]) => signInMock(...args),
    signOut: vi.fn(),
}));

vi.mock("../data", () => ({
    fetchCampaign: vi.fn(),
    fetchUID: (...args: unknown[]) => fetchUIDMock(...args),
    fetchDashboardNumber: vi.fn(),
}));

vi.mock("../utils", () => ({
    saltAndHashPassword: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        user: {
            delete: (...args: unknown[]) => userDeleteMock(...args),
        },
        campaign: {
            findUnique: (...args: unknown[]) => campaignFindUniqueMock(...args),
        },
        character: {
            update: (...args: unknown[]) => characterUpdateMock(...args),
            delete: (...args: unknown[]) => characterDeleteMock(...args),
            create: (...args: unknown[]) => characterCreateMock(...args),
        },
        dashboard: {
            delete: (...args: unknown[]) => dashboardDeleteMock(...args),
        },
    },
}));

import {
    checkDMStatus,
    deleteDashboardByDashboardID,
    deleteUser,
    deleteCharacter,
    importCharacter,
    loginGoogle,
    updateCharacter,
} from "../actions";

function updateCharacterFormData() {
    const formData = new FormData();
    formData.set("user_id", "ABCDEFGHIJ");
    formData.set("name", "Aria");
    formData.set("description", "Wizard");
    formData.set("character_type", "Player");
    formData.set("species", "Elf");
    formData.set("cclass", "ma");
    formData.set("level", "3");
    formData.set("portrait_url", "https://example.com/aria.png");
    formData.set("strength", "8");
    formData.set("dexterity", "14");
    formData.set("constitution", "12");
    formData.set("intelligence", "16");
    formData.set("wisdom", "10");
    formData.set("charisma", "11");
    formData.set("max_hit_points", "20");
    formData.set("armor_class", "13");
    return formData;
}

const validImportPayload = {
    name: "Aria",
    description: "Wizard",
    character_type: "Player",
    species: "Elf",
    cclass: "ma",
    level: 3,
    portrait_url: "https://example.com/aria.png",
    strength: 8,
    dexterity: 14,
    constitution: 12,
    intelligence: 16,
    wisdom: 10,
    charisma: 11,
    max_hit_points: 20,
    current_hit_points: 12,
    temp_hit_points: 0,
    load_capacity: 120,
    backpack_capacity: 60,
    armor_class: 13,
    Inventory: [
        {
            i: 0,
            slot: "bp",
            name: "Book",
            description: "Spellbook",
            category: "tool",
            weight: 3,
            quantity: 1,
            magic: false,
        },
    ],
    Currency: {
        platinum: 1,
        gold: 20,
        silver: 5,
        copper: 2,
    },
    CharacterInfo: {
        abilities: "Arcana",
        conditions: "",
        notes: "",
    },
    SpellSlot: [
        {
            level: 1,
            total_casts: 4,
            casts_remaining: 3,
        },
    ],
};

describe("actions remaining branches", () => {
    beforeEach(() => {
        revalidatePathMock.mockReset();
        redirectMock.mockReset();
        signInMock.mockReset();
        nanoidMock.mockReset();
        fetchUIDMock.mockReset();
        userDeleteMock.mockReset();
        campaignFindUniqueMock.mockReset();
        characterUpdateMock.mockReset();
        characterDeleteMock.mockReset();
        characterCreateMock.mockReset();
        dashboardDeleteMock.mockReset();
    });

    it("loginGoogle calls signIn with google provider redirect", async () => {
        await loginGoogle();

        expect(signInMock).toHaveBeenCalledWith("google", { redirectTo: "/campaigns", redirect: true });
    });

    it("deleteUser deletes by email", async () => {
        userDeleteMock.mockResolvedValue({});

        await deleteUser("player@example.com");

        expect(userDeleteMock).toHaveBeenCalledWith({ where: { email: "player@example.com" } });
    });

    it("deleteUser throws wrapped error on failure", async () => {
        userDeleteMock.mockRejectedValue(new Error("db error"));

        await expect(deleteUser("player@example.com")).rejects.toThrow("Failed to delete user.");
    });

    it("checkDMStatus returns true when user is DM", async () => {
        campaignFindUniqueMock.mockResolvedValue({ dm_id: "dm-1" });

        await expect(checkDMStatus("camp-1", "dm-1")).resolves.toBe(true);
    });

    it("checkDMStatus returns false when user is not DM", async () => {
        campaignFindUniqueMock.mockResolvedValue({ dm_id: "dm-1" });

        await expect(checkDMStatus("camp-1", "other-user")).resolves.toBe(false);
    });

    it("checkDMStatus throws when campaign is missing", async () => {
        campaignFindUniqueMock.mockResolvedValue(null);

        await expect(checkDMStatus("camp-1", "dm-1")).rejects.toThrow("Campaign not found");
    });

    it("updateCharacter returns database error message on failure", async () => {
        characterUpdateMock.mockRejectedValue(new Error("db error"));

        const result = await updateCharacter("char-1", "camp-1", updateCharacterFormData());

        expect(result).toEqual({ message: "Database Error: Failed to Update Character." });
    });

    it("deleteCharacter returns database error message on failure", async () => {
        characterDeleteMock.mockRejectedValue(new Error("db error"));

        const result = await deleteCharacter("char-1", "camp-1");

        expect(result).toEqual({ message: "Database Error: Failed to Delete Character." });
    });

    it("importCharacter creates nested structures and redirects", async () => {
        fetchUIDMock.mockResolvedValue("ABCDEFGHIJ");
        nanoidMock.mockImplementation(() => "GENID12345");
        characterCreateMock.mockResolvedValue({});

        await importCharacter("camp-1", validImportPayload as any);

        expect(characterCreateMock).toHaveBeenCalledTimes(1);
        expect(characterCreateMock.mock.calls[0][0].data.Currency.create.gold).toBe(20);
        expect(characterCreateMock.mock.calls[0][0].data.InventoryItem.create).toHaveLength(1);
        expect(characterCreateMock.mock.calls[0][0].data.SpellSlot.create).toHaveLength(1);
        expect(revalidatePathMock).toHaveBeenCalledWith("/campaigns/camp-1");
        expect(redirectMock).toHaveBeenCalledWith("/campaigns/camp-1");
    });

    it("importCharacter throws on invalid payload schema", async () => {
        fetchUIDMock.mockResolvedValue("ABCDEFGHIJ");

        await expect(importCharacter("camp-1", {} as any)).rejects.toThrow();
    });

    it("importCharacter returns database error on create failure", async () => {
        fetchUIDMock.mockResolvedValue("ABCDEFGHIJ");
        characterCreateMock.mockRejectedValue(new Error("db error"));

        const result = await importCharacter("camp-1", validImportPayload as any);

        expect(result).toEqual({ message: "Database Error: Failed to Import Character." });
    });

    it("deleteDashboardByDashboardID deletes and redirects", async () => {
        dashboardDeleteMock.mockResolvedValue({});

        await deleteDashboardByDashboardID("dash-1", "camp-1");

        expect(dashboardDeleteMock).toHaveBeenCalledWith({ where: { dashboard_id: "dash-1" } });
        expect(revalidatePathMock).toHaveBeenCalledWith("/campaigns/camp-1");
        expect(redirectMock).toHaveBeenCalledWith("/campaigns/camp-1");
    });

    it("deleteDashboardByDashboardID returns database error message on failure", async () => {
        dashboardDeleteMock.mockRejectedValue(new Error("db error"));

        const result = await deleteDashboardByDashboardID("dash-1", "camp-1");

        expect(result).toEqual({ message: "Database Error: Failed to Delete Dashboard." });
    });
});
