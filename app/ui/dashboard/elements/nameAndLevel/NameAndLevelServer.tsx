'use server'

import { getClasses } from '@/lib/utils';
import { notFound } from 'next/navigation';
import NameAndLevelClient from './NameAndLevelClient';
import { prisma } from '@/lib/prisma';

const NameAndLevelServer = async ({ character_id }: { character_id: string }) => {

    const character = await prisma.character.findFirst({ where: { character_id }, select: { name: true, cclass: true, level: true } });
    if (!character) {
        notFound();
    }

    const cclass = getClasses('en').find(c => c.key === character.cclass)?.value || '';

    return (
        <NameAndLevelClient name={character.name} cclass={cclass} il={character.level} />
    );
};

export default NameAndLevelServer;