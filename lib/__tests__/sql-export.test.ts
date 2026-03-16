import { describe, expect, it } from "vitest";

import { buildSqlExport, generateInsertStatements } from "../sql-export";

describe("generateInsertStatements", () => {
    it("returns empty string for no rows", () => {
        expect(generateInsertStatements("User", [], "user_id")).toBe("");
    });

    it("formats mixed SQL value types and escapes apostrophes", () => {
        const sql = generateInsertStatements(
            "Character",
            [
                {
                    character_id: "c1",
                    name: "O'Brien",
                    created_at: new Date("2026-03-16T12:00:00.000Z"),
                    level: 3,
                    active: true,
                    score: BigInt(9007199254740991),
                    notes: null,
                },
            ],
            "character_id",
        );

        expect(sql).toContain("INSERT INTO \"Character\"");
        expect(sql).toContain("'O''Brien'");
        expect(sql).toContain("'2026-03-16T12:00:00.000Z'");
        expect(sql).toContain("true");
        expect(sql).toContain("9007199254740991");
        expect(sql).toContain("NULL");
        expect(sql).toContain("ON CONFLICT (\"character_id\") DO NOTHING;");
    });
});

describe("buildSqlExport", () => {
    it("skips empty table chunks and separates non-empty sections", () => {
        const sql = buildSqlExport([
            {
                tableName: "User",
                primaryKey: "user_id",
                rows: [{ user_id: "u1", username: "Aria" }],
            },
            {
                tableName: "Campaign",
                primaryKey: "campaign_id",
                rows: [],
            },
            {
                tableName: "Character",
                primaryKey: "character_id",
                rows: [{ character_id: "c1", name: "Mage" }],
            },
        ]);

        expect(sql).toContain("INSERT INTO \"User\"");
        expect(sql).toContain("INSERT INTO \"Character\"");
        expect(sql).not.toContain("INSERT INTO \"Campaign\"");
        expect(sql).toContain("\n\n");
    });
});
