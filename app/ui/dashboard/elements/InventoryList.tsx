import { InventoryItem } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';
import CustomTable from './inventory/CustomTable';

const InventoryList = async ({ character_id }: { character_id: string }) => {
    const data = await sql<InventoryItem>`SELECT item_name, description, quantity, magic, slot FROM Inventory WHERE character_id = ${character_id}`;
    const items: InventoryItem[] = data.rows;
    if (items.length === 0) {
        notFound();
    }

    return (
        <div className="inventory -z-50">
            <h2 className='text-2xl'>Inventory</h2>
            <CustomTable items={items}/>
        </div>
    );
};

export default InventoryList;
