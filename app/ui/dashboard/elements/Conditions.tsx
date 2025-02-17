'use server'

import OnLeaveTextArea from './helper/OnLeaveTextArea';
import { SunSnow } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Dictionary } from '@/app/[lang]/dictionaries';


const Conditions = async ({ character_id, dict }: { character_id: string, dict: Dictionary }) => {
    const characterInfo = await prisma.characterInfo.findFirst({ where: { character_id }, select: { conditions: true } });
    if (!characterInfo) return <></>;

    async function updateConditions(conditions: string) {
        'use server'
        await prisma.characterInfo.updateMany({
            where: { character_id },
            data: { conditions }
        });
    }

    return (
        <div className="h-full">
            <span className='flex items-center pt-3 ml-3'><SunSnow className='h-7 w-7 mr-3' /><h2 className='text-2xl'>{dict.dashboard.conditions}</h2></span>
            <div className='pt-3' style={{ height: "calc(100% - 44px)" }}>
                <OnLeaveTextArea initialValue={characterInfo.conditions || ""} onLeave={updateConditions} className='h-full border-x-0 rounded-none' placeholder={dict.dashboard.conditionsPlaceholder} />
            </div>
        </div>
    );
};

export default Conditions;
