import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidatePathMock = vi.fn();
const redirectMock = vi.fn();
const signInMock = vi.fn();
const signOutMock = vi.fn();
const fetchUIDMock = vi.fn();
const fetchDashboardNumberMock = vi.fn();
const nanoidMock = vi.fn();

const campaignCreateMock = vi.fn();
const campaignUpdateMock = vi.fn();
const campaignDeleteMock = vi.fn();
const campaignUserDeleteMock = vi.fn();
const characterCreateMock = vi.fn();
const characterUpdateMock = vi.fn();
const characterDeleteMock = vi.fn();
const characterFindUniqueMock = vi.fn();
const dashboardCreateMock = vi.fn();
const dashboardFindUniqueMock = vi.fn();

const cookiesMock = vi.fn();

const { MockAuthError } = vi.hoisted(() => ({
    MockAuthError: class MockAuthError extends Error {
        type: string;

        constructor(type: string) {
            super(type);
            this.type = type;
        }
    },
}));

vi.mock("next/cache", () => ({
    revalidatePath: (...args: unknown[]) => revalidatePathMock(...args),
}));

vi.mock("next/navigation", () => ({
    redirect: (...args: unknown[]) => redirectMock(...args),
}));

vi.mock("next-auth", () => ({
    AuthError: MockAuthError,
}));

vi.mock("next/headers", () => ({
    cookies: (...args: unknown[]) => cookiesMock(...args),
}));

vi.mock("nanoid", () => ({
    nanoid: (...args: unknown[]) => nanoidMock(...args),
}));

vi.mock("@/lib/auth", () => ({
    signIn: (...args: unknown[]) => signInMock(...args),
    signOut: (...args: unknown[]) => signOutMock(...args),
}));

vi.mock("../data", () => ({
    fetchUID: (...args: unknown[]) => fetchUIDMock(...args),
    fetchDashboardNumber: (...args: unknown[]) => fetchDashboardNumberMock(...args),
    fetchCampaign: vi.fn(),
}));

vi.mock("../utils", () => ({
    saltAndHashPassword: vi.fn().mockResolvedValue("hash"),
}));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        campaign: {
            create: (...args: unknown[]) => campaignCreateMock(...args),
            update: (...args: unknown[]) => campaignUpdateMock(...args),
            delete: (...args: unknown[]) => campaignDeleteMock(...args),
        },
        campaignUser: {
            delete: (...args: unknown[]) => campaignUserDeleteMock(...args),
        },
        character: {
            create: (...args: unknown[]) => characterCreateMock(...args),
            update: (...args: unknown[]) => characterUpdateMock(...args),
            delete: (...args: unknown[]) => characterDeleteMock(...args),
            findUnique: (...args: unknown[]) => characterFindUniqueMock(...args),
        },
        dashboard: {
            create: (...args: unknown[]) => dashboardCreateMock(...args),
            findUnique: (...args: unknown[]) => dashboardFindUniqueMock(...args),
        },
    },
}));

import {
    authenticate,
    createCampaign,
    createCharacter,
    createCharacterDashboard,
    deleteCampaign,
    deleteCampaignUser,
    exportCharacter,
    logOut,
    updateCampaign,
} from "../actions";

function validCharacterFormData() {
    const formData = new FormData();
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

describe("actions additional branches", () => {
    beforeEach(() => {
        revalidatePathMock.mockReset();
        redirectMock.mockReset();
        signInMock.mockReset();
        signOutMock.mockReset();
        fetchUIDMock.mockReset();
        fetchDashboardNumberMock.mockReset();
        nanoidMock.mockReset();
        campaignCreateMock.mockReset();
        campaignUpdateMock.mockReset();
        campaignDeleteMock.mockReset();
        campaignUserDeleteMock.mockReset();
        characterCreateMock.mockReset();
        characterUpdateMock.mockReset();
        characterDeleteMock.mockReset();
        characterFindUniqueMock.mockReset();
        dashboardCreateMock.mockReset();
        dashboardFindUniqueMock.mockReset();
        cookiesMock.mockReset();
    });

    it("authenticate maps credential auth error to message", async () => {
        signInMock.mockRejectedValue(new MockAuthError("CredentialsSignin"));
        const formData = new FormData();
        formData.set("email", "player@example.com");
        formData.set("password", "wrong");

        const result = await authenticate(undefined, formData);

        expect(result).toBe("Invalid credentials");
    });

    it("logOut uses locale cookie path for signout and redirects", async () => {
        cookiesMock.mockResolvedValue({
            get: vi.fn().mockReturnValue({ value: "de" }),
        });

        await logOut();

        expect(signOutMock).toHaveBeenCalledWith({ redirectTo: "/de/login" });
        expect(revalidatePathMock).toHaveBeenCalledWith("/de/campaigns");
        expect(redirectMock).toHaveBeenCalledWith("/de/login");
    });

    it("createCampaign returns database error on failure", async () => {
        fetchUIDMock.mockResolvedValue("user-1");
        campaignCreateMock.mockRejectedValue(new Error("db error"));
        const formData = new FormData();
        formData.set("name", "Campaign");
        formData.set("description", "Desc");
        formData.set("password", "");

        const result = await createCampaign(formData);

        expect(result).toEqual({ message: "Database Error: Failed to Create Campaign." });
    });

    it("updateCampaign returns database error on failure", async () => {
        fetchUIDMock.mockResolvedValue("user-1");
        campaignUpdateMock.mockRejectedValue(new Error("db error"));
        const formData = new FormData();
        formData.set("name", "Campaign");
        formData.set("description", "Desc");
        formData.set("password", "");

        const result = await updateCampaign("camp-1", formData);

        expect(result).toEqual({ message: "Database Error: Failed to Update Campaign." });
    });

    it("deleteCampaign denies deletion for non-DM users", async () => {
        fetchUIDMock.mockResolvedValue("user-2");

        const result = await deleteCampaign("camp-1", "user-1");

        expect(result).toEqual({ message: "Only the DM can delete the campaign" });
        expect(campaignDeleteMock).not.toHaveBeenCalled();
    });

    it("deleteCampaignUser returns database error on failure", async () => {
        campaignUserDeleteMock.mockRejectedValue(new Error("db error"));

        const result = await deleteCampaignUser("cu-1", "camp-1");

        expect(result).toEqual({ message: "Database Error: Failed to Delete Campaign User." });
    });

    it("createCharacter returns database error on failure", async () => {
        fetchUIDMock.mockResolvedValue("ABCDEFGHIJ");
        characterCreateMock.mockRejectedValue(new Error("db error"));

        const result = await createCharacter("camp-1", validCharacterFormData());

        expect(result).toEqual({ message: "Database Error: Failed to Create Character." });
    });

    it("exportCharacter throws when character does not exist", async () => {
        characterFindUniqueMock.mockResolvedValue(null);

        await expect(exportCharacter("char-1")).rejects.toThrow("Character not found");
    });

    it("exportCharacter maps nested db fields to export payload shape", async () => {
        characterFindUniqueMock.mockResolvedValue({
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
            current_hit_points: 15,
            temp_hit_points: 2,
            load_capacity: 120,
            backpack_capacity: 60,
            armor_class: 13,
            InventoryItem: [{ i: 0, slot: "bp", item_name: "Book", description: "Spellbook", category: "tool", weight: 3, quantity: 1, magic: false }],
            Currency: [{ platin: 1, gold: 20, silver: 5, copper: 2 }],
            CharacterInfo: [{ abilities: "Arcana", conditions: "", notes: "" }],
            SpellSlot: [{ spell_level: 1, total_casts: 4, casts_remaining: 3 }],
        });

        const result = await exportCharacter("char-1");

        expect(result.Currency.platinum).toBe(1);
        expect(result.Inventory[0].name).toBe("Book");
        expect(result.SpellSlot[0].level).toBe(1);
    });

    it("createCharacterDashboard returns error if source dashboard is missing", async () => {
        fetchDashboardNumberMock.mockResolvedValue(1);
        dashboardFindUniqueMock.mockResolvedValue(null);
        nanoidMock.mockReturnValue("new-dashboard");

        const result = await createCharacterDashboard("d1", "camp-1", "char-1", "Aria");

        expect(result).toEqual({ message: "Database Error: Failed to Create Dashboard." });
    });
});
