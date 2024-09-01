'use server'

import { CharacterInfo } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import OnLeaveTextArea from './helper/OnLeaveTextArea';
import { BookUp2 } from 'lucide-react';

const Abilities = async ({ character_id }: { character_id: string }) => {
    const data = await sql<CharacterInfo>`SELECT character_info_id, abilities FROM CharacterInfos WHERE character_id = ${character_id}`;
    const characterInfo: CharacterInfo = data.rows[0];
    const noAbilities = !characterInfo;

    async function updateAbilities(abilities: string) {
        'use server'
        await sql`UPDATE CharacterInfos SET abilities = ${abilities} WHERE character_info_id = ${characterInfo.character_info_id}`;
    }

    return (
        <div className="h-full">
            <span className='flex items-center pt-3 ml-3'><BookUp2 className='h-7 w-7 mr-3' /><h2 className='text-2xl'>Abilities</h2></span>
            {noAbilities && <p>No abilities.</p>}
            {!noAbilities &&
                <div className='pt-3' style={{ height: "calc(100% - 44px)" }}>
                    <OnLeaveTextArea initialValue={characterInfo.abilities} onLeave={updateAbilities} className='h-full border-x-0 rounded-none' placeholder='Write down abilities, skills, etc.' />
                </div>
            }
        </div>
    );
};

export default Abilities;
