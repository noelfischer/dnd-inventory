import { beforeEach, describe, expect, it, vi } from "vitest";

const { findManyMock, createMock, updateMock, nanoidMock } = vi.hoisted(() => ({
    findManyMock: vi.fn(),
    createMock: vi.fn(),
    updateMock: vi.fn(),
    nanoidMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        spellSlot: {
            findMany: findManyMock,
            create: createMock,
            update: updateMock,
        },
    },
}));

vi.mock("nanoid", () => ({
    nanoid: (...args: unknown[]) => nanoidMock(...args),
}));

import {
    getSpellSlots,
    updateRemainingCasts,
    updateSpellSlots,
    updateTotalCasts,
} from "./helper";

describe("spellslots helper", () => {
    beforeEach(() => {
        findManyMock.mockReset();
        createMock.mockReset();
        updateMock.mockReset();
        nanoidMock.mockReset();
        nanoidMock.mockImplementation(() => "generated-id");
    });

    it("fills missing spell slot levels and sorts 0 to 10", async () => {
        findManyMock.mockResolvedValue([
            { spell_slot_id: "s3", spell_level: 3, total_casts: 2, casts_remaining: 1 },
            { spell_slot_id: "s1", spell_level: 1, total_casts: 4, casts_remaining: 3 },
        ]);

        const result = await getSpellSlots("char-1");

        expect(result).toHaveLength(11);
        expect(result.map((slot) => slot.spell_level)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(result.find((slot) => slot.spell_level === 1)?.spell_slot_id).toBe("s1");
        expect(result.find((slot) => slot.spell_level === 3)?.spell_slot_id).toBe("s3");
    });

    it("does not create generated slots when all levels already exist", async () => {
        findManyMock.mockResolvedValue(
            Array.from({ length: 11 }, (_, level) => ({
                spell_slot_id: `slot-${level}`,
                spell_level: level,
                total_casts: 1,
                casts_remaining: 1,
            })),
        );

        const result = await getSpellSlots("char-1");

        expect(result).toHaveLength(11);
        expect(nanoidMock).not.toHaveBeenCalled();
    });

    it("creates slot when updating remaining casts and slot does not exist", async () => {
        findManyMock.mockResolvedValue([]);

        await updateRemainingCasts("char-1", {
            spell_slot_id: "slot-1",
            spell_level: 2,
            total_casts: 5,
            casts_remaining: 4,
        });

        expect(createMock).toHaveBeenCalledWith({
            data: {
                spell_slot_id: "slot-1",
                character_id: "char-1",
                spell_level: 2,
                total_casts: 5,
                casts_remaining: 4,
            },
        });
        expect(updateMock).not.toHaveBeenCalled();
    });

    it("updates slot when updating remaining casts and slot exists", async () => {
        findManyMock.mockResolvedValue([{ spell_slot_id: "slot-1" }]);

        await updateRemainingCasts("char-1", {
            spell_slot_id: "slot-1",
            spell_level: 2,
            total_casts: 5,
            casts_remaining: 1,
        });

        expect(updateMock).toHaveBeenCalledWith({
            where: { spell_slot_id: "slot-1" },
            data: { casts_remaining: 1 },
        });
        expect(createMock).not.toHaveBeenCalled();
    });

    it("updates total casts when slot exists", async () => {
        findManyMock.mockResolvedValue([{ spell_slot_id: "slot-1" }]);

        await updateTotalCasts("char-1", {
            spell_slot_id: "slot-1",
            spell_level: 2,
            total_casts: 7,
            casts_remaining: 3,
        });

        expect(updateMock).toHaveBeenCalledWith({
            where: { spell_slot_id: "slot-1" },
            data: { total_casts: 7 },
        });
    });

    it("creates and updates only necessary slots in bulk update", async () => {
        findManyMock.mockResolvedValue([
            {
                spell_slot_id: "existing-unchanged",
                character_id: "char-1",
                spell_level: 1,
                total_casts: 4,
                casts_remaining: 2,
            },
            {
                spell_slot_id: "existing-changed",
                character_id: "char-1",
                spell_level: 2,
                total_casts: 3,
                casts_remaining: 1,
            },
        ]);

        await updateSpellSlots("char-1", [
            {
                spell_slot_id: "existing-unchanged",
                spell_level: 1,
                total_casts: 4,
                casts_remaining: 2,
            },
            {
                spell_slot_id: "existing-changed",
                spell_level: 2,
                total_casts: 5,
                casts_remaining: 0,
            },
            {
                spell_slot_id: "new-slot",
                spell_level: 3,
                total_casts: 2,
                casts_remaining: 2,
            },
        ]);

        expect(updateMock).toHaveBeenCalledTimes(1);
        expect(updateMock).toHaveBeenCalledWith({
            where: { spell_slot_id: "existing-changed" },
            data: { total_casts: 5, casts_remaining: 0 },
        });
        expect(createMock).toHaveBeenCalledTimes(1);
        expect(createMock).toHaveBeenCalledWith({
            data: {
                spell_slot_id: "new-slot",
                character_id: "char-1",
                spell_level: 3,
                total_casts: 2,
                casts_remaining: 2,
            },
        });
    });
});
