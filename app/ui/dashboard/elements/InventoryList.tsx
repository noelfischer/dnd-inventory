'use server'

import { InventoryItem } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import DraggableTables from './helper/DraggableTables';

const InventoryList = async ({ character_id }: { character_id: string }) => {
    const data = await sql<InventoryItem>`SELECT item_id, character_id, i, slot, item_name, description, ability, weight, category, magic, quantity FROM Inventory WHERE character_id = ${character_id}`;
    const items: InventoryItem[] = data.rows;

    return (
        <div className="inventory -z-50">
            <DraggableTables initialItems={items} />
        </div>
    );
};

export default InventoryList;
