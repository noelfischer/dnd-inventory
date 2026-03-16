import { describe, expect, it } from "vitest";

import {
    getCardData,
    getCardDropTargetData,
    getColumnData,
    isCardData,
    isCardDropTargetData,
    isColumnData,
    isDraggingACard,
    isDraggingAColumn,
} from "./data";

describe("pragmatic-board shared data helpers", () => {
    const card = {
        id: "card-1",
        gridRow: () => null,
    };

    const column = {
        id: "col-1",
        title: "Backpack",
        header: () => null,
        footer: () => null,
        cards: [card],
    };

    it("creates and detects card data", () => {
        const cardData = getCardData({
            card,
            rect: {} as DOMRect,
            columnId: "bp",
        });

        expect(isCardData(cardData)).toBe(true);
        expect(isCardData({})).toBe(false);
        expect(cardData.columnId).toBe("bp");
        expect(cardData.card).toBe(card);
    });

    it("detects when the drag source is a card", () => {
        const cardData = getCardData({
            card,
            rect: {} as DOMRect,
            columnId: "eq",
        });

        expect(isDraggingACard({ source: { data: cardData } })).toBe(true);
        expect(isDraggingACard({ source: { data: {} } })).toBe(false);
    });

    it("creates and detects card drop target data", () => {
        const dropTarget = getCardDropTargetData({ card, columnId: "bd" });

        expect(isCardDropTargetData(dropTarget)).toBe(true);
        expect(isCardDropTargetData({})).toBe(false);
        expect(dropTarget.card).toBe(card);
    });

    it("creates and detects column data", () => {
        const columnData = getColumnData({ column });

        expect(isColumnData(columnData)).toBe(true);
        expect(isColumnData({})).toBe(false);
        expect(isDraggingAColumn({ source: { data: columnData } })).toBe(true);
        expect(isDraggingAColumn({ source: { data: {} } })).toBe(false);
    });
});
