'use server'

import { Currency } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import CurrencyClient from './CurrencyClient';

const CurrencyServer = async ({ character_id }: { character_id: string }) => {
    const data = await sql<Currency>`SELECT platin, gold, silver, copper FROM Currency WHERE character_id = ${character_id}`;
    const currency = data.rows[0];
    const noCurrency = !currency;

    async function updatePlatinum(value: string) {
        'use server'
        await sql`UPDATE Currency SET platin = ${value} WHERE character_id = ${character_id}`;
    }

    async function updateGold(value: string) {
        'use server'
        await sql`UPDATE Currency SET gold = ${value} WHERE character_id = ${character_id}`;
    }

    async function updateSilver(value: string) {
        'use server'
        await sql`UPDATE Currency SET silver = ${value} WHERE character_id = ${character_id}`;
    }

    async function updateCopper(value: string) {
        'use server'
        await sql`UPDATE Currency SET copper = ${value} WHERE character_id = ${character_id}`;
    }

    return (
        <CurrencyClient initial_currency={currency} updatePlatinum={updatePlatinum} updateGold={updateGold} updateSilver={updateSilver} updateCopper={updateCopper} />
    );
};

export default CurrencyServer;
