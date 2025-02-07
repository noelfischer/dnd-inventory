'use server'

import OnLeaveTextArea from './helper/OnLeaveTextArea';
import { BookUp2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';


const Abilities = async ({ character_id }: { character_id: string }) => {
    const characterInfo = await prisma.characterInfo.findFirst({ where: { character_id }, select: { abilities: true } });
    if (!characterInfo) return <></>;

    async function updateAbilities(abilities: string) {
        'use server'
        await prisma.characterInfo.updateMany({
            where: { character_id },
            data: { abilities }
        });
    }

    return (
        <div className="h-full">
            <span className='flex items-center pt-3 ml-3'><BookUp2 className='h-7 w-7 mr-3' /><h2 className='text-2xl'>Abilities</h2></span>
            <div className='pt-3' style={{ height: "calc(100% - 44px)" }}>
                <OnLeaveTextArea initialValue={characterInfo.abilities || ""} onLeave={updateAbilities} className='h-full border-x-0 rounded-none' placeholder='Write down abilities, skills, etc.' />
            </div>

        </div>
    );
};

export default Abilities;
