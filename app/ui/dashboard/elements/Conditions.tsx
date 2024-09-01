'use server'

import { CharacterInfo } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import OnLeaveTextArea from './helper/OnLeaveTextArea';

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
            <h2 className='text-2xl pt-3 ml-3'>Conditions</h2>
            {noConditions && <p>No conditions.</p>}
            {!noConditions &&
                <div className='pt-3' style={{ height: "calc(100% - 44px)" }}>
                    <OnLeaveTextArea initialValue={characterInfo.conditions} onLeave={updateConditions} className='h-full border-x-0 rounded-none' />
                </div>
            }
        </div>
    );
};

export default Conditions;
