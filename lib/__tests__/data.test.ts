import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUniqueMock, findManyMock } = vi.hoisted(() => ({
    findUniqueMock: vi.fn(),
    findManyMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
    auth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    redirect: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        dashboard: {
            findUnique: findUniqueMock,
            findMany: findManyMock,
        },
    },
}));

import { fetchNavLinksByDashboard } from "../data";

describe("fetchNavLinksByDashboard", () => {
    beforeEach(() => {
        findUniqueMock.mockReset();
        findManyMock.mockReset();
    });

    it("groups character dashboards by character type and includes party", async () => {
        findUniqueMock.mockResolvedValue({ campaign_id: "camp-1" });
        findManyMock
            .mockResolvedValueOnce([
                {
                    dashboard_id: "d1",
                    name: "Aria Board",
                    character_id: "c1",
                    Character: { character_type: "Player" },
                },
                {
                    dashboard_id: "d2",
                    name: "Goblin Board",
                    character_id: "c2",
                    Character: { character_type: "Enemy" },
                },
                {
                    dashboard_id: "d3",
                    name: "Bryn Board",
                    character_id: "c3",
                    Character: { character_type: "Player" },
                },
            ])
            .mockResolvedValueOnce([
                {
                    dashboard_id: "d4",
                    name: "Party Dashboard",
                },
            ]);

        const result = await fetchNavLinksByDashboard("dash-root");

        expect(result).toEqual([
            {
                name: "Player",
                links: [
                    { name: "Aria Board", id: "d1" },
                    { name: "Bryn Board", id: "d3" },
                ],
            },
            {
                name: "Enemy",
                links: [{ name: "Goblin Board", id: "d2" }],
            },
            {
                name: "Party",
                links: [{ name: "Party Dashboard", id: "d4" }],
            },
        ]);
    });

    it("uses Unknown when character relation is missing", async () => {
        findUniqueMock.mockResolvedValue({ campaign_id: "camp-1" });
        findManyMock
            .mockResolvedValueOnce([
                {
                    dashboard_id: "d1",
                    name: "Mystery Board",
                    character_id: "c1",
                    Character: null,
                },
            ])
            .mockResolvedValueOnce([]);

        const result = await fetchNavLinksByDashboard("dash-root");

        expect(result).toEqual([
            {
                name: "Unknown",
                links: [{ name: "Mystery Board", id: "d1" }],
            },
        ]);
    });
});
