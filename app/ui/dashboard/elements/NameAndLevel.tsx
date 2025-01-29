'use server'

import { getClasses } from '@/app/lib/utils';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient()


const NameAndLevel = async ({ character_id }: { character_id: string }) => {

    const character = await prisma.character.findFirst({ where: { character_id }, select: { name: true, cclass: true, level: true } });
    if (!character) {
        notFound();
    }

    const cclass = getClasses('en').find(c => c.key === character.cclass)?.value;

    return (
        <div>
            <h1 className='text-3xl'>{character.name}, {cclass}, Level {character.level}</h1>
        </div>
    );
};

export default NameAndLevel;