'use server'

import { sql } from "@vercel/postgres"
import OnLeaveInput from "./helper/OnLeaveInput";
import { Dices } from "lucide-react";

const Inspiration = async ({ character_id }: { character_id: string }) => {
    const data = await sql`SELECT inspiration FROM Characters WHERE character_id = ${character_id}`;
    const inspiration = data.rows[0].inspiration;

    async function updateInspiration(inspiration: string) {
        'use server'
        const inspirationNumber = parseInt(inspiration);
        if (isNaN(inspirationNumber)) return;
        await sql`UPDATE Characters SET inspiration = ${inspirationNumber} WHERE character_id = ${character_id}`;
    }

    return (
        <div className="flex items-center justify-around px-4 h-full">

            <span className="text-2xl">Inspiration</span>
            <span className="flex">
                <OnLeaveInput className="text-5xl pb-14 border-b-[4px] mb-3" initialValue={inspiration} onLeave={updateInspiration} />
                <Dices className="mt-2 ml-1" />
            </span>
        </div>
    );
}

export default Inspiration;