'use server'

import { CharacterInfo } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import OnLeaveTextArea from './helper/OnLeaveTextArea';

const Notes = async ({ character_id }: { character_id: string }) => {
    const data = await sql<CharacterInfo>`SELECT character_info_id, notes FROM CharacterInfos WHERE character_id = ${character_id}`;
    const characterInfo: CharacterInfo = data.rows[0];
    const noNotes = !characterInfo;

    async function updateNotes(notes: string) {
        'use server'
        await sql`UPDATE CharacterInfos SET notes = ${notes} WHERE character_info_id = ${characterInfo.character_info_id}`;
    }

    return (
        <div className="h-full">
            <h2 className='text-2xl pt-3 ml-3'>Notes</h2>
            {noNotes && <p>No notes.</p>}
            {!noNotes &&
                <div className='pt-3' style={{ height: "calc(100% - 44px)" }}>
                    <OnLeaveTextArea initialValue={characterInfo.notes} onLeave={updateNotes} className='h-full border-x-0 rounded-none' />
                </div>
            }
        </div>
    );
};

export default Notes;
