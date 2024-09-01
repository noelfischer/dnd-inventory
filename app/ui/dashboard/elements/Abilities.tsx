'use server'

import { CharacterInfo } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import OnLeaveTextArea from './helper/OnLeaveTextArea';

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
            <h2 className='text-2xl pt-3 ml-3'>Abilities</h2>
            {noAbilities && <p>No abilities.</p>}
            {!noAbilities &&
                <div className='pt-3' style={{ height: "calc(100% - 44px)" }}>
                    <OnLeaveTextArea initialValue={characterInfo.abilities} onLeave={updateAbilities} className='h-full border-x-0 rounded-none' />
                </div>
            }
        </div>
    );
};

export default Abilities;
