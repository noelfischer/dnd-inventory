import { InventoryItem } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';

const InventoryList = async ({ character_id }: { character_id: string }) => {
    const data = await sql<InventoryItem>`SELECT item_name, description, quantity, magic FROM Inventory WHERE character_id = ${character_id}`;
    const items = data.rows;
    if (items.length === 0) {
        notFound();
    }

    return (
        <div className="inventory">
            <h2 className='text-2xl'>Inventory</h2>
            <ul>
                {items.map(item => (
                    <li key={item.item_id}>
                        {item.item_name} (x{item.quantity}) {item.magic ? '(Magic)' : ''}
                        <p>{item.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InventoryList;
