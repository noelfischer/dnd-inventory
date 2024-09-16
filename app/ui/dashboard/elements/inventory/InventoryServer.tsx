'use server'

import { InventoryItem } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import InventoryClient from './InventoryClient';
import { nanoid } from 'nanoid';

const InventoryServer = async ({ character_id }: { character_id: string }) => {
    const data = await sql<InventoryItem>`SELECT item_id, character_id, i, slot, item_name, description, ability, weight, category, magic, quantity FROM Inventory WHERE character_id = ${character_id}`;
    const items: InventoryItem[] = data.rows;

    const characterData = await sql`SELECT backpack_capacity FROM Characters WHERE character_id = ${character_id}`;
    const backpackCapacity = characterData.rows[0].backpack_capacity;

    async function updateIndex(items: { item_id: string, i: number, slot: string }[]) {
        'use server'
        for (let i = 0; i < items.length; i++) {
            await sql`UPDATE Inventory SET i = ${i}, slot = ${items[i].slot} WHERE item_id = ${items[i].item_id}`;
        }
    }

    async function createItem(item: InventoryItem): Promise<string> {
        'use server'

        const itemId = nanoid(10);
        await sql`INSERT INTO Inventory (item_id, character_id, i, slot, item_name, description, ability, weight, category, magic, quantity) VALUES (${itemId}, ${character_id}, ${items.length}, ${item.slot}, ${item.item_name}, ${item.description}, ${item.ability}, ${item.weight}, ${item.category}, ${item.magic}, ${item.quantity})`;
        return itemId;
    }

    async function updateItem(item: InventoryItem) {
        'use server'
        await sql`UPDATE Inventory SET item_name = ${item.item_name}, description = ${item.description}, ability = ${item.ability}, weight = ${item.weight}, category = ${item.category}, magic = ${item.magic}, quantity = ${item.quantity}, slot = ${item.slot}, i = ${item.i}
        WHERE item_id = ${item.item_id}`;
    }

    async function deleteItem(item_id: string) {
        'use server'
        await sql`DELETE FROM Inventory WHERE item_id = ${item_id}`;
    }

    async function updateBackpackCapacity(capacity: number) {
        'use server'
        await sql`UPDATE Characters SET backpack_capacity = ${capacity} WHERE character_id = ${character_id}`;
    }

    return (
        <div className="inventory -z-50">
            <InventoryClient initialItems={items} initialBackpackCapacity={backpackCapacity} createItem={createItem} updateItem={updateItem} deleteItem={deleteItem} updateIndex={updateIndex} updateBackpackCapacity={updateBackpackCapacity} />
        </div>
    );
};

export default InventoryServer;
