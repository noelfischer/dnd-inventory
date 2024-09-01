'use server'

import { CharacterInfo } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import OnLeaveTextArea from './helper/OnLeaveTextArea';
import { SunSnow } from 'lucide-react';

const Conditions = async ({ character_id }: { character_id: string }) => {
    const data = await sql<CharacterInfo>`SELECT character_info_id, conditions FROM CharacterInfos WHERE character_id = ${character_id}`;
    const characterInfo: CharacterInfo = data.rows[0];
    const noConditions = !characterInfo;

    async function updateConditions(conditions: string) {
        'use server'
        await sql`UPDATE CharacterInfos SET conditions = ${conditions} WHERE character_info_id = ${characterInfo.character_info_id}`;
    }

    return (
        <div className="h-full">
            <span className='flex items-center pt-3 ml-3'><SunSnow className='h-7 w-7 mr-3' /><h2 className='text-2xl'>Conditions</h2></span>
            {noConditions && <p>No conditions.</p>}
            {!noConditions &&
                <div className='pt-3' style={{ height: "calc(100% - 44px)" }}>
                    <OnLeaveTextArea initialValue={characterInfo.conditions} onLeave={updateConditions} className='h-full border-x-0 rounded-none' placeholder='Write down conditions like poison, exhaustion, disadvantage, etc.' />
                </div>
            }
        </div>
    );
};

export default Conditions;
