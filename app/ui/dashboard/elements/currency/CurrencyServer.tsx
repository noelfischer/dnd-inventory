'use server'

import CurrencyClient from './CurrencyClient';
import { prisma } from '@/lib/prisma';

const CurrencyServer = async ({ character_id }: { character_id: string }) => {
    const currency = await prisma.currency.findFirst({ where: { character_id } });
    if (!currency) return <></>;

    async function updatePlatinum(value: number) {
        'use server'
        await prisma.currency.updateMany({
            where: { character_id },
            data: { platin: value }
        });
    }

    async function updateGold(value: number) {
        'use server'
        await prisma.currency.updateMany({
            where: { character_id },
            data: { gold: value }
        });
    }

    async function updateSilver(value: number) {
        'use server'
        await prisma.currency.updateMany({
            where: { character_id },
            data: { silver: value }
        });
    }

    async function updateCopper(value: number) {
        'use server'
        await prisma.currency.updateMany({
            where: { character_id },
            data: { copper: value }
        });
    }

    return (
        <CurrencyClient initial_currency={currency} updatePlatinum={updatePlatinum} updateGold={updateGold} updateSilver={updateSilver} updateCopper={updateCopper} />
    );
};

export default CurrencyServer;
