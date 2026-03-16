import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
    createInventoryItem,
    formatInitialItemstoTableData,
    removeItemFromInventory,
    type Item,
    updateInventoryItem,
} from "./helper";

class CustomEventMock<T = unknown> {
    type: string;
    detail: T;

    constructor(type: string, init?: { detail?: T }) {
        this.type = type;
        this.detail = init?.detail as T;
    }
}

function baseItem(overrides: Record<string, unknown> = {}) {
    return {
        item_id: "item-1",
        character_id: "char-1",
        i: 0,
        slot: "eq",
        item_name: "Rope",
        description: "50 feet",
        weight: 2,
        category: "gear",
        magic: false,
        quantity: 1,
        ...overrides,
    };
}

describe("inventory helper", () => {
    const dispatchEvent = vi.fn();

    beforeEach(() => {
        dispatchEvent.mockReset();
        vi.stubGlobal("window", { dispatchEvent });
        vi.stubGlobal("CustomEvent", CustomEventMock as unknown as typeof CustomEvent);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("formats initial items into sorted table groups", () => {
        const items = [
            baseItem({ item_id: "a", slot: "bp", i: 2 }),
            baseItem({ item_id: "b", slot: "bp", i: 0 }),
            baseItem({ item_id: "c", slot: "eq", i: 1 }),
        ] as any;

        const result = formatInitialItemstoTableData(items);

        expect(result.map((table) => table.name)).toEqual(["eq", "bd", "bp"]);
        expect(result[2].rows.map((row) => row.item_id)).toEqual(["b", "a"]);
    });

    it("creates a new inventory item and dispatches weight event", async () => {
        const tables: Item[] = [
            { name: "eq", rows: [baseItem({ item_id: "eq-1", weight: 2, quantity: 2 }) as any] },
            { name: "bd", rows: [] },
            { name: "bp", rows: [] },
        ];

        const formData = new FormData();
        formData.set("slot", "bp");
        formData.set("item_name", "Potion");
        formData.set("description", "Healing");
        formData.set("weight", "0.5");
        formData.set("category", "consumable");
        formData.set("quantity", "3");
        formData.set("magic", "on");

        const createItem = vi.fn().mockResolvedValue("new-item-id");
        const updatedTables = await createInventoryItem(formData, tables, createItem);

        expect(createItem).toHaveBeenCalledTimes(1);
        expect(updatedTables[2].rows).toHaveLength(1);
        expect(updatedTables[2].rows[0].item_id).toBe("new-item-id");
        expect(dispatchEvent).toHaveBeenCalledTimes(1);
        expect((dispatchEvent.mock.calls[0][0] as any).detail).toBe(5.5);
    });

    it("updates item in place when slot does not change", async () => {
        const tables: Item[] = [
            { name: "eq", rows: [baseItem({ item_id: "eq-1", slot: "eq", quantity: 1 }) as any] },
            { name: "bd", rows: [] },
            { name: "bp", rows: [] },
        ];
        const updateItem = vi.fn().mockResolvedValue(undefined);
        const formData = new FormData();
        formData.set("slot", "eq");
        formData.set("item_name", "Rope Updated");
        formData.set("description", "Updated");
        formData.set("weight", "3");
        formData.set("category", "gear");
        formData.set("quantity", "2");

        const [updatedTables, promise] = updateInventoryItem(
            tables[0].rows[0] as any,
            formData,
            tables,
            updateItem,
        );
        await promise;

        expect(updatedTables[0].rows[0].item_name).toBe("Rope Updated");
        expect(updateItem).toHaveBeenCalledTimes(1);
        expect(dispatchEvent).toHaveBeenCalledTimes(1);
    });

    it("moves item to a new slot when slot changes", async () => {
        const tables: Item[] = [
            { name: "eq", rows: [baseItem({ item_id: "eq-1", slot: "eq" }) as any] },
            { name: "bd", rows: [] },
            { name: "bp", rows: [] },
        ];
        const updateItem = vi.fn().mockResolvedValue(undefined);
        const formData = new FormData();
        formData.set("slot", "bp");
        formData.set("item_name", "Moved Item");
        formData.set("description", "Moved");
        formData.set("weight", "1");
        formData.set("category", "gear");
        formData.set("quantity", "1");

        const [updatedTables, promise] = updateInventoryItem(
            tables[0].rows[0] as any,
            formData,
            tables,
            updateItem,
        );
        await promise;

        expect(updatedTables[0].rows).toHaveLength(0);
        expect(updatedTables[2].rows).toHaveLength(1);
        expect(updatedTables[2].rows[0].slot).toBe("bp");
    });

    it("removes item and dispatches updated weight", async () => {
        const tables: Item[] = [
            {
                name: "eq",
                rows: [baseItem({ item_id: "x", weight: 2, quantity: 1 }) as any],
            },
            {
                name: "bd",
                rows: [baseItem({ item_id: "y", slot: "bd", weight: 4, quantity: 1 }) as any],
            },
            { name: "bp", rows: [] },
        ];
        const deleteItem = vi.fn().mockResolvedValue(undefined);

        const [updatedTables, promise] = removeItemFromInventory(
            "x",
            tables,
            deleteItem
        ) as [Item[], Promise<void>];
        await promise;

        expect(updatedTables[0].rows).toHaveLength(0);
        expect(deleteItem).toHaveBeenCalledWith("x");
        expect((dispatchEvent.mock.calls[0][0] as any).detail).toBe(4);
    });

    it("dispatches zero weight when inventory becomes empty", async () => {
        const tables: Item[] = [
            { name: "eq", rows: [] },
            { name: "bd", rows: [baseItem({ item_id: "only", slot: "bd", weight: 2, quantity: 1 }) as any] },
            { name: "bp", rows: [] },
        ];
        const deleteItem = vi.fn().mockResolvedValue(undefined);

        const [updatedTables, promise] = removeItemFromInventory(
            "only",
            tables,
            deleteItem
        ) as [Item[], Promise<void>];
        await promise;

        expect(updatedTables[1].rows).toHaveLength(0);
        expect((dispatchEvent.mock.calls[0][0] as any).detail).toBe(0);
    });
});
