'use server'


import { PrismaClient } from '@prisma/client';
import OnLeaveTextArea from './helper/OnLeaveTextArea';
import { ScrollText } from 'lucide-react';

const prisma = new PrismaClient()


const Notes = async ({ character_id }: { character_id: string }) => {
    const characterInfo = await prisma.characterInfo.findFirst({ where: { character_id }, select: { notes: true } });
    if (!characterInfo) return <></>;

    async function updateNotes(notes: string) {
        'use server'
        await prisma.characterInfo.updateMany({
            where: { character_id },
            data: { notes }
        });
    }

    return (
        <div className="h-full">
            <span className='flex items-center pt-3 ml-3'><ScrollText className='h-7 w-7 mr-3' /><h2 className='text-2xl'>Notes</h2></span>
            <div className='pt-3' style={{ height: "calc(100% - 44px)" }}>
                <OnLeaveTextArea initialValue={characterInfo.notes || ""} onLeave={updateNotes} className='h-full border-x-0 rounded-none' placeholder='Write down personal notes like quests, relationships, etc.' />
            </div>
        </div>
    );
};

export default Notes;
