'use server'

import { Character } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import WeightClient from './WeightClient';

const WeightServer = async ({ character_id }: { character_id: string }) => {
    const maxWeightData = await sql<Character>`SELECT load_capacity FROM Characters WHERE character_id = ${character_id}`;
    const maxWeight: number = maxWeightData.rows[0].load_capacity;
    const inventoryWeightData = await sql`SELECT SUM(weight * quantity) as total_weight FROM Inventory WHERE character_id = ${character_id}`;
    const inventoryWeight: number = inventoryWeightData.rows[0].total_weight;
    const currencyData = await sql`SELECT platin, gold, silver, copper FROM Currency WHERE character_id = ${character_id}`;
    const coinsWeight: number = (currencyData.rows[0].platin + currencyData.rows[0].gold + currencyData.rows[0].silver + currencyData.rows[0].copper) * 0.02;



    async function updateTotalCarriableWeight(capacity: number) {
        'use server'
        await sql`UPDATE Characters SET load_capacity = ${capacity} WHERE character_id = ${character_id}`;
    }

    return (
        <div className="w-full h-full">
            <WeightClient max_weight={maxWeight} inventory_weight={inventoryWeight} coins_weight={coinsWeight} updateTotalCarriableWeight={updateTotalCarriableWeight} />
        </div>
    );
};

export default WeightServer;
