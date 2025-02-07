'use server'

import WeightClient from './WeightClient';
import { prisma } from '@/lib/prisma';

const WeightServer = async ({ character_id }: { character_id: string }) => {

    const maxWeight = (await prisma.character.findFirst({ where: { character_id }, select: { load_capacity: true } }))!.load_capacity;
    const currencyData = await prisma.currency.findFirst({ where: { character_id }, select: { platin: true, gold: true, silver: true, copper: true } });
    const coinsWeight: number = (currencyData!.platin + currencyData!.gold + currencyData!.silver + currencyData!.copper) * 0.02;
    const inventoryItems = await prisma.inventoryItem.findMany({
        where: { character_id: character_id },
        select: { weight: true, quantity: true },
    });

    const inventoryWeight = inventoryItems.reduce((sum, item) => sum + item.weight * item.quantity, 0);




    async function updateTotalCarriableWeight(capacity: number) {
        'use server'
        await prisma.character.updateMany({
            where: { character_id },
            data: { load_capacity: capacity }
        });
    }

    return (
        <div className="w-full h-full">
            <WeightClient max_weight={maxWeight} inventory_weight={inventoryWeight} coins_weight={coinsWeight} updateTotalCarriableWeight={updateTotalCarriableWeight} />
        </div>
    );
};

export default WeightServer;
