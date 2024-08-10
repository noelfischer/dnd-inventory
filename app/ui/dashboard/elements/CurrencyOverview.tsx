'use server'

import { Currency } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';

const CurrencyOverview = async ({ character_id }: { character_id: string }) => {
    const data = await sql<Currency>`SELECT platin, gold, silver, copper FROM Currency WHERE character_id = ${character_id}`;
    const currency = data.rows[0];
    const noCurrency = !currency;

    return (
        <div className="currency">
            <h2 className='text-2xl'>Currency</h2>
            {noCurrency && <p>No currency.</p>}
            {!noCurrency &&
                <ul>
                    <li>Platinum: {currency.platin}</li>
                    <li>Gold: {currency.gold}</li>
                    <li>Silver: {currency.silver}</li>
                    <li>Copper: {currency.copper}</li>
                </ul>
            }
        </div>
    );
};

export default CurrencyOverview;
