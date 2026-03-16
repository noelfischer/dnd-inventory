import { beforeEach, describe, expect, it, vi } from "vitest";

const {
    revalidatePathMock,
    redirectMock,
    nanoidMock,
    dashboardElementFindManyMock,
    dashboardElementUpsertMock,
    dashboardElementDeleteManyMock,
    dashboardElementFindFirstMock,
    dashboardElementCreateMock,
} = vi.hoisted(() => ({
    revalidatePathMock: vi.fn(),
    redirectMock: vi.fn(),
    nanoidMock: vi.fn(),
    dashboardElementFindManyMock: vi.fn(),
    dashboardElementUpsertMock: vi.fn(),
    dashboardElementDeleteManyMock: vi.fn(),
    dashboardElementFindFirstMock: vi.fn(),
    dashboardElementCreateMock: vi.fn(),
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
    signIn: vi.fn(),
    signOut: vi.fn(),
}));

vi.mock("../data", () => ({
    fetchCampaign: vi.fn(),
    fetchUID: vi.fn(),
    fetchDashboardNumber: vi.fn(),
}));

vi.mock("../utils", () => ({
    saltAndHashPassword: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        dashboardElement: {
            findMany: (...args: unknown[]) => dashboardElementFindManyMock(...args),
            upsert: (...args: unknown[]) => dashboardElementUpsertMock(...args),
            deleteMany: (...args: unknown[]) => dashboardElementDeleteManyMock(...args),
            findFirst: (...args: unknown[]) => dashboardElementFindFirstMock(...args),
            create: (...args: unknown[]) => dashboardElementCreateMock(...args),
        },
    },
}));

import { createDashboardElement, updateDashboardLayout } from "../actions";

describe("actions dashboard branches", () => {
    beforeEach(() => {
        revalidatePathMock.mockReset();
        redirectMock.mockReset();
        nanoidMock.mockReset();
        dashboardElementFindManyMock.mockReset();
        dashboardElementUpsertMock.mockReset();
        dashboardElementDeleteManyMock.mockReset();
        dashboardElementFindFirstMock.mockReset();
        dashboardElementCreateMock.mockReset();
    });

    it("replaces temporary ids, upserts layout elements, and removes deleted ids", async () => {
        nanoidMock.mockReturnValue("NEWID12345");
        dashboardElementFindManyMock.mockResolvedValue([{ element_id: "OLDDELETE01" }]);
        dashboardElementUpsertMock.mockResolvedValue({});
        dashboardElementDeleteManyMock.mockResolvedValue({});

        const layout = {
            lg: [{ i: "00000000-temp,inventory,char-1", w: 3, h: 2, x: 1, y: 1 }],
            md: [{ i: "00000000-temp,inventory,char-1", w: 2, h: 2, x: 0, y: 0 }],
        };

        await updateDashboardLayout("dash-1", layout);

        expect(dashboardElementUpsertMock).toHaveBeenCalledTimes(1);
        expect(dashboardElementUpsertMock.mock.calls[0][0].create.element_id).toBe("NEWID12345");
        expect(dashboardElementDeleteManyMock).toHaveBeenCalledWith({
            where: { element_id: { in: ["OLDDELETE01"] } },
        });
        expect(revalidatePathMock).toHaveBeenCalledWith("/dashboard/dash-1");
        expect(redirectMock).toHaveBeenCalledWith("/dashboard/dash-1");
    });

    it("returns error message when layout update fails", async () => {
        dashboardElementFindManyMock.mockRejectedValue(new Error("db error"));

        const result = await updateDashboardLayout("dash-1", { lg: [] });

        expect(result).toEqual({ message: "Database Error: Failed to Update Dashboard Layout." });
    });

    it("returns existing-element message when creating duplicate dashboard element", async () => {
        dashboardElementFindFirstMock.mockResolvedValue({ element_id: "exists" });
        const formData = new FormData();
        formData.set("character", "char-1");
        formData.set("element", "inventory");

        const result = await createDashboardElement("dash-1", formData);

        expect(result).toBe("Element already exists");
        expect(dashboardElementCreateMock).not.toHaveBeenCalled();
    });

    it("creates new dashboard element with defaults and redirects", async () => {
        nanoidMock.mockReturnValue("ELEM123456");
        dashboardElementFindFirstMock.mockResolvedValue(null);
        dashboardElementCreateMock.mockResolvedValue({});

        const formData = new FormData();
        formData.set("character", "char-1");
        formData.set("element", "inventory");

        await createDashboardElement("dash-1", formData);

        expect(dashboardElementCreateMock).toHaveBeenCalledWith({
            data: {
                element_id: "ELEM123456",
                dashboard_id: "dash-1",
                character_id: "char-1",
                element_type: "inventory",
                x_lg: 9,
                y_lg: 9999,
                w_lg: 3,
                h_lg: 2,
            },
        });
        expect(revalidatePathMock).toHaveBeenCalledWith("/dashboard/dash-1");
        expect(redirectMock).toHaveBeenCalledWith("/dashboard/dash-1");
    });
});
