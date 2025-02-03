import { InventoryItem } from '@prisma/client';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import { createContext, MutableRefObject } from 'react';


export type HandleRef = MutableRefObject<HTMLDivElement | null> | undefined;

export type Props = {
    initialItems: InventoryItem[];
    initialBackpackCapacity: number;
    createItem: (item: InventoryItem) => Promise<string>;
    updateItem: (item: InventoryItem) => Promise<void>;
    deleteItem: (item_id: string) => Promise<void>;
    updateIndex: (items: { item_id: string; i: number; slot: string; }[]) => void;
    updateBackpackCapacity: (capacity: number) => void;
};

export type Item = {
    name: string;
    rows: InventoryItem[];
};

export type ItemRegistration = {
    item: Item;
    element: HTMLElement;
    index: number;
};

export type ReorderFunction = (args: {
    startIndex: number;
    indexOfTarget: number;
    closestEdgeOfTarget?: Edge | null;
}) => void;

type UnregisterFn = () => void;

export type ItemContextValue = {
    getItemsForColumnPreview: () => {
        items: Item[];
        isMoreItems: boolean;
    };
    reorderColumn: ReorderFunction;
    reorderItem: ReorderFunction;
    register: (args: ItemRegistration) => UnregisterFn;
    instanceId: symbol | null;
};
export const TableContext = createContext<ItemContextValue>({
    getItemsForColumnPreview: () => ({ items: [], isMoreItems: false }),
    reorderColumn: () => { },
    reorderItem: () => { },
    register: function register() {
        return function unregister() { };
    },
    instanceId: null,
});



export function formatInitialItemstoTableData(initialItems: InventoryItem[]): Item[] {
    return [
        { name: "eq", rows: initialItems.filter(i => i.slot == "eq").sort((a, b) => a.i - b.i) },
        { name: "bd", rows: initialItems.filter(i => i.slot == "bd").sort((a, b) => a.i - b.i) },
        { name: "bp", rows: initialItems.filter(i => i.slot == "bp").sort((a, b) => a.i - b.i) },
    ];
}

export async function createInventoryItem(formData: FormData, tables: Item[], createItem: (item: InventoryItem) => Promise<string>) {

    const allTablesRowsLength = tables.map(table => table.rows.length).reduce((acc, curr) => acc + curr);
    const newItem: InventoryItem = {
        item_id: '0',
        character_id: '0',
        i: allTablesRowsLength,
        slot: formData.get('slot') as string,
        item_name: formData.get('item_name') as string,
        description: formData.get('description') as string,
        weight: parseFloat(formData.get('weight') as string),
        category: formData.get('category') as string,
        magic: formData.get('magic') === 'on',
        quantity: parseInt(formData.get('quantity') as string)
    }
    const item_id = await createItem(newItem);
    newItem.item_id = item_id;

    const table = tables.find(table => table.name === newItem.slot);
    table?.rows.push(newItem);

    const event = new CustomEvent('inventoryWeight', { detail: tables.map(table => table.rows).flat().map(row => row.weight * row.quantity).reduce((acc, curr) => acc + curr, 0) });
    window.dispatchEvent(event);

    return tables;
}


export function updateInventoryItem(item: InventoryItem, formData: FormData, tables: Item[], updateItem: (item: InventoryItem) => Promise<void>): [Item[], Promise<void>] {
    const newItem: InventoryItem = {
        item_id: item.item_id,
        character_id: item.character_id,
        i: item.i,
        slot: formData.get('slot') as string,
        item_name: formData.get('item_name') as string,
        description: formData.get('description') as string,
        weight: parseFloat(formData.get('weight') as string),
        category: formData.get('category') as string,
        magic: formData.get('magic') === 'on',
        quantity: parseInt(formData.get('quantity') as string)
    }
    tables.forEach(table => {
        table.rows.forEach((row, index) => {
            if (row.item_id === item.item_id) {
                //check if the slot has changed
                if (row.slot !== newItem.slot) {
                    const newTable = tables.find(table => table.name === newItem.slot);
                    if (newTable) {
                        newItem.i = newTable.rows.length;
                        newTable.rows.push(newItem);
                        table.rows.splice(index, 1);
                    }
                } else {
                    table.rows[index] = newItem;
                }

            }
        });
    });

    const event = new CustomEvent('inventoryWeight', { detail: tables.map(table => table.rows).flat().map(row => row.weight * row.quantity).reduce((acc, curr) => acc + curr, 0) });
    window.dispatchEvent(event);
    const promise = updateItem(newItem);

    return [tables, promise];
}

export function removeItemFromInventory(itemid: string, tables: Item[], deleteItem: (item_id: string) => Promise<void>) {
    tables.forEach(table => {
        const newRows = table.rows.filter(row => row.item_id !== itemid);
        table.rows = newRows;
    });

    const event = new CustomEvent('inventoryWeight', { detail: tables.map(table => table.rows).flat().map(row => row.weight * row.quantity).reduce((acc, curr) => acc + curr, 0) });
    window.dispatchEvent(event);
    const promise = deleteItem(itemid);
    return [tables, promise];
}
