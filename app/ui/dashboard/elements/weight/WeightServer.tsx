'use server'

import { PrismaClient } from '@prisma/client';
import WeightClient from './WeightClient';

const prisma = new PrismaClient()


const WeightServer = async ({ character_id }: { character_id: string }) => {

    const maxWeight = (await prisma.character.findFirst({ where: { character_id }, select: { load_capacity: true } }))!.load_capacity;
    const currencyData = await prisma.currency.findFirst({ where: { character_id }, select: { platin: true, gold: true, silver: true, copper: true } });
    const coinsWeight: number = (currencyData!.platin + currencyData!.gold + currencyData!.silver + currencyData!.copper) * 0.02;
    const inventory: any = await prisma.inventoryItem.aggregate({
        _sum: {
            weight: true,
            quantity: true,
        },
        where: {
            character_id: character_id,
        },
    });
    const inventoryWeight = inventory._sum.weight * inventory._sum.quantity;




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
