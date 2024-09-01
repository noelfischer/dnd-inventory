'use server'

import { Currency } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import OnLeaveInput from './helper/OnLeaveInput';
import { cn } from '@/lib/utils';

const CurrencyOverview = async ({ character_id }: { character_id: string }) => {
    const data = await sql<Currency>`SELECT platin, gold, silver, copper FROM Currency WHERE character_id = ${character_id}`;
    const currency = data.rows[0];
    const noCurrency = !currency;

    async function updatePlatinum(value: string) {
        'use server'
        const amount = parseInt(value);
        if (isNaN(amount)) return;
        await sql`UPDATE Currency SET platin = ${amount} WHERE character_id = ${character_id}`;
    }

    async function updateGold(value: string) {
        'use server'
        const amount = parseInt(value);
        if (isNaN(amount)) return;
        await sql`UPDATE Currency SET gold = ${amount} WHERE character_id = ${character_id}`;
    }

    async function updateSilver(value: string) {
        'use server'
        const amount = parseInt(value);
        if (isNaN(amount)) return;
        await sql`UPDATE Currency SET silver = ${amount} WHERE character_id = ${character_id}`;
    }

    async function updateCopper(value: string) {
        'use server'
        const amount = parseInt(value);
        if (isNaN(amount)) return;
        await sql`UPDATE Currency SET copper = ${amount} WHERE character_id = ${character_id}`;
    }

    const ListItem = ({ value, label, onLeave, className }: { value: number, label: string, onLeave: (value: string) => void, className?: string }) => {
        return (
            <li key={label} className='text-text p-1 w-1/2 -m-1 min-w-28 w-32 grow'>
                <div className={cn('rounded-md m-0 border-2 border-black dark:border-black shadow-light dark:shadow-dark', className)}>
                    <div className={cn((label === "Platinum" || label == "Gold" ? 'card-shine-effect' : ''), "rounded-md transition-all bg-main/70 hover:bg-main/0")}>
                        <div className='text-center pt-2'>{label}</div>
                        <div className='border-b-2 border-black mt-3 mb-3'></div>
                        <div className='flex justify-center'><OnLeaveInput className='text-text border-black text-3xl pb-9 border-b-[4px] mb-6' onLeave={onLeave} initialValue={value.toString()} /></div>
                    </div>
                </div>
            </li>
        );
    }

    return (
        <div className="currency m-1">
            {noCurrency && <p>No currency.</p>}
            {!noCurrency &&
                <ul className="flex flex-row gap-2 flex-wrap">
                    <ListItem value={currency.platin} label="Platinum" className='platinum' onLeave={updatePlatinum} />
                    <ListItem value={currency.gold} label="Gold" className='gold' onLeave={updateGold} />
                    <ListItem value={currency.silver} label="Silver" className='silver' onLeave={updateSilver} />
                    <ListItem value={currency.copper} label="Copper" className='copper' onLeave={updateCopper} />
                </ul>
            }
        </div>
    );
};

export default CurrencyOverview;
