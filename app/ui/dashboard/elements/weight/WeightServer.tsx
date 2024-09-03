'use server'

import { Character } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';
import WeightClient from './WeightClient';

const WeightServer = async ({ character_id }: { character_id: string }) => {
    const inventoryWeight = 2;
    const coinsWeight = 2;
    const maxWeight = 5;


    async function updateTotalCarriableWeight(health: number) {
        'use server'
    }

    return (
        <div className="w-full h-full">
            <WeightClient max_weight={maxWeight} current_weight={inventoryWeight + coinsWeight} updateTotalCarriableWeight={updateTotalCarriableWeight} />
        </div>
    );
};

export default WeightServer;
