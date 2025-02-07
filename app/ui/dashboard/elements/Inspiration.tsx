'use server'

import OnLeaveInput from "./helper/OnLeaveInput";
import { Dices } from "lucide-react";
import { prisma } from '@/lib/prisma';


const Inspiration = async ({ character_id }: { character_id: string }) => {
    const character = await prisma.character.findFirst({ where: { character_id }, select: { inspiration: true } });
    if (!character) return <></>;

    async function updateInspiration(inspiration: string) {
        'use server'
        const inspirationNumber = parseInt(inspiration);
        if (isNaN(inspirationNumber)) return;
        await prisma.character.updateMany({
            where: { character_id },
            data: { inspiration: inspirationNumber }
        });
    }

    return (
        <div className="flex items-center justify-around px-4 h-full overflow-y-hidden">

            <span className="text-2xl">Inspiration</span>
            <span className="flex">
                <OnLeaveInput className="text-5xl pb-14 border-b-[4px] mb-3" initialValue={character.inspiration.toString()} onLeave={updateInspiration} />
                <Dices className="mt-2 ml-1" />
            </span>
        </div>
    );
}

export default Inspiration;