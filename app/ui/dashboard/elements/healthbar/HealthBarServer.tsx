'use server'

import { notFound } from 'next/navigation';
import HealthBarClient from './HealthBarClient';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()


const HealthBarServer = async ({ character_id }: { character_id: string }) => {
    const character = await prisma.character.findFirst({ where: { character_id }, select: { max_hit_points: true, current_hit_points: true, temp_hit_points: true } });
    if (!character) {
        notFound();
    }

    async function updateCurrentHealth(health: number) {
        'use server'
        await prisma.character.update({
            where: { character_id },
            data: { current_hit_points: health }
        });
    }

    async function updateTotalHealth(health: number) {
        'use server'
        await prisma.character.update({
            where: { character_id },
            data: { max_hit_points: health }
        });
    }

    async function updateTempHealth(health: number) {
        'use server'
        await prisma.character.update({
            where: { character_id },
            data: { temp_hit_points: health }
        });
    }

    const { max_hit_points, current_hit_points, temp_hit_points } = character;

    return (
        <div className="w-full h-full">
            <HealthBarClient max_hit_points={max_hit_points} current_hit_points={current_hit_points} temp_hit_points={temp_hit_points} updateCurrentHealth={updateCurrentHealth} updateMaxHealth={updateTotalHealth} updateTempHealth={updateTempHealth} />
        </div>
    );
};

export default HealthBarServer;
