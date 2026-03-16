import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidatePathMock = vi.fn();
const redirectMock = vi.fn();
const nanoidMock = vi.fn();
const signInMock = vi.fn();
const signOutMock = vi.fn();
const fetchCampaignMock = vi.fn();
const fetchUIDMock = vi.fn();
const fetchDashboardNumberMock = vi.fn();
const saltAndHashPasswordMock = vi.fn();

const userFindUniqueMock = vi.fn();
const userCreateMock = vi.fn();
const credentialCreateMock = vi.fn();
const transactionMock = vi.fn();
const campaignUserFindManyMock = vi.fn();
const campaignUserCreateMock = vi.fn();
const characterUpdateManyMock = vi.fn();
const characterFindUniqueMock = vi.fn();
const characterCreateMock = vi.fn();
const dashboardUpdateManyMock = vi.fn();
const dashboardCreateMock = vi.fn();

vi.mock("next/cache", () => ({
    revalidatePath: (...args: unknown[]) => revalidatePathMock(...args),
}));

vi.mock("next/navigation", () => ({
    redirect: (...args: unknown[]) => redirectMock(...args),
}));

vi.mock("next/headers", () => ({
    cookies: vi.fn(),
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

vi.mock("nanoid", () => ({
    nanoid: (...args: unknown[]) => nanoidMock(...args),
}));

vi.mock("@/lib/auth", () => ({
    signIn: (...args: unknown[]) => signInMock(...args),
    signOut: (...args: unknown[]) => signOutMock(...args),
}));

vi.mock("../data", () => ({
    fetchCampaign: (...args: unknown[]) => fetchCampaignMock(...args),
    fetchUID: (...args: unknown[]) => fetchUIDMock(...args),
    fetchDashboardNumber: (...args: unknown[]) => fetchDashboardNumberMock(...args),
}));

vi.mock("../utils", () => ({
    saltAndHashPassword: (...args: unknown[]) => saltAndHashPasswordMock(...args),
}));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        user: {
            findUnique: (...args: unknown[]) => userFindUniqueMock(...args),
            create: (...args: unknown[]) => userCreateMock(...args),
        },
        credential: {
            create: (...args: unknown[]) => credentialCreateMock(...args),
        },
        campaignUser: {
            findMany: (...args: unknown[]) => campaignUserFindManyMock(...args),
            create: (...args: unknown[]) => campaignUserCreateMock(...args),
        },
        character: {
            updateMany: (...args: unknown[]) => characterUpdateManyMock(...args),
            findUnique: (...args: unknown[]) => characterFindUniqueMock(...args),
            create: (...args: unknown[]) => characterCreateMock(...args),
        },
        dashboard: {
            updateMany: (...args: unknown[]) => dashboardUpdateManyMock(...args),
            create: (...args: unknown[]) => dashboardCreateMock(...args),
        },
        $transaction: (...args: unknown[]) => transactionMock(...args),
    },
}));

import {
    addUserToCampaign,
    createUser,
    duplicateCharacter,
    moveCharacter,
    signUp,
} from "../actions";

describe("actions", () => {
    beforeEach(() => {
        revalidatePathMock.mockReset();
        redirectMock.mockReset();
        nanoidMock.mockReset();
        signInMock.mockReset();
        signOutMock.mockReset();
        fetchCampaignMock.mockReset();
        fetchUIDMock.mockReset();
        fetchDashboardNumberMock.mockReset();
        saltAndHashPasswordMock.mockReset();
        userFindUniqueMock.mockReset();
        userCreateMock.mockReset();
        credentialCreateMock.mockReset();
        transactionMock.mockReset();
        campaignUserFindManyMock.mockReset();
        campaignUserCreateMock.mockReset();
        characterUpdateManyMock.mockReset();
        characterFindUniqueMock.mockReset();
        characterCreateMock.mockReset();
        dashboardUpdateManyMock.mockReset();
        dashboardCreateMock.mockReset();
    });

    it("createUser throws when email already exists", async () => {
        saltAndHashPasswordMock.mockResolvedValue("hash");
        userFindUniqueMock.mockResolvedValue({ user_id: "existing" });

        await expect(createUser("player@example.com", "secret123", "Player")).rejects.toThrow(
            "Failed to create user.",
        );
        expect(transactionMock).not.toHaveBeenCalled();
    });

    it("createUser creates user and credential in one transaction", async () => {
        saltAndHashPasswordMock.mockResolvedValue("hash");
        nanoidMock.mockReturnValue("user-1");
        userFindUniqueMock.mockResolvedValue(null);
        transactionMock.mockResolvedValue([{ user_id: "user-1", email: "player@example.com" }]);

        const result = await createUser("player@example.com", "secret123", "Player");

        expect(transactionMock).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ user_id: "user-1", email: "player@example.com" });
    });

    it("signUp returns message when duplicate user exists", async () => {
        const formData = new FormData();
        formData.set("email", "player@example.com");
        formData.set("password", "secret123");
        formData.set("username", "Player");

        saltAndHashPasswordMock.mockResolvedValue("hash");
        userFindUniqueMock.mockResolvedValue({ user_id: "existing" });

        const result = await signUp(undefined, formData);
        expect(result).toBe("Email already exists");
        expect(signInMock).not.toHaveBeenCalled();
    });

    it("addUserToCampaign rejects incorrect campaign password", async () => {
        fetchUIDMock.mockResolvedValue("user-1");
        campaignUserFindManyMock.mockResolvedValue([]);
        fetchCampaignMock.mockResolvedValue({ password: "correct-password" });

        const result = await addUserToCampaign("campaign-1", "wrong-password");

        expect(result).toEqual({ message: "Incorrect password" });
        expect(campaignUserCreateMock).not.toHaveBeenCalled();
    });

    it("moveCharacter updates both character and dashboards", async () => {
        transactionMock.mockResolvedValue([]);
        const formData = new FormData();
        formData.set("new_campaign_id", "campaign-2");

        await moveCharacter("char-1", "campaign-1", formData);

        expect(transactionMock).toHaveBeenCalledTimes(1);
        expect(revalidatePathMock).toHaveBeenCalledWith("/campaigns/campaign-1");
        expect(revalidatePathMock).toHaveBeenCalledWith("/campaigns/campaign-2");
        expect(redirectMock).toHaveBeenCalledWith("/campaigns/campaign-1");
    });

    it("duplicateCharacter returns database error message when source character is missing", async () => {
        fetchUIDMock.mockResolvedValue("user-1");
        nanoidMock.mockReturnValue("new-id");
        characterFindUniqueMock.mockResolvedValue(null);

        const result = await duplicateCharacter("char-1", "campaign-1", "Aria");

        expect(result).toEqual({ message: "Database Error: Failed to Create Character." });
    });

    it("duplicateCharacter creates character copy and dashboard", async () => {
        fetchUIDMock.mockResolvedValue("user-1");
        nanoidMock.mockReturnValueOnce("new-character-id").mockReturnValueOnce("new-dashboard-id");
        characterFindUniqueMock.mockResolvedValue({
            character_id: "char-1",
            campaign_id: "campaign-1",
            user_id: "old-user",
            name: "Aria",
        });
        characterCreateMock.mockResolvedValue({});
        dashboardCreateMock.mockResolvedValue({});

        await duplicateCharacter("char-1", "campaign-1", "Aria");

        expect(characterCreateMock).toHaveBeenCalledTimes(1);
        expect(dashboardCreateMock).toHaveBeenCalledTimes(1);
        expect(revalidatePathMock).toHaveBeenCalledWith("/campaigns/campaign-1");
        expect(redirectMock).toHaveBeenCalledWith("/campaigns/campaign-1");
    });
});
