'use server'

import { InventoryItem } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import InventoryClient from './InventoryClient';

const InventoryServer = async ({ character_id }: { character_id: string }) => {
    const data = await sql<InventoryItem>`SELECT item_id, character_id, i, slot, item_name, description, ability, weight, category, magic, quantity FROM Inventory WHERE character_id = ${character_id}`;
    const items: InventoryItem[] = data.rows;

    async function updateIndex(items: { item_id: string, i: number, slot: string }[]) {
        'use server'
        for (let i = 0; i < items.length; i++) {
            await sql`UPDATE Inventory SET i = ${i}, slot = ${items[i].slot} WHERE item_id = ${items[i].item_id}`;
        }
    }

    return (
        <div className="inventory -z-50">
            <InventoryClient initialItems={items} updateIndex={updateIndex} />
        </div>
    );
};

export default InventoryServer;
