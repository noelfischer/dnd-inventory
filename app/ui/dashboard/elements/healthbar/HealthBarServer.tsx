'use server'

import { Character } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';
import HealthBarClient from './HealthBarClient';

const HealthBarServer = async ({ character_id }: { character_id: string }) => {
    const data = await sql<Character>`SELECT max_hit_points, current_hit_points, temp_hit_points FROM Characters WHERE character_id = ${character_id}`;
    const character = data.rows[0];
    if (!character) {
        notFound();
    }

    async function updateCurrentHealth(health: number) {
        'use server'
        await sql`UPDATE Characters SET current_hit_points = ${health} WHERE character_id = ${character_id}`;
    }

    async function updateTotalHealth(health: number) {
        'use server'
        await sql`UPDATE Characters SET max_hit_points = ${health} WHERE character_id = ${character_id}`;
    }

    async function updateTempHealth(health: number) {
        'use server'
        character.temp_hit_points = health;
        await sql`UPDATE Characters SET temp_hit_points = ${health} WHERE character_id = ${character_id}`;
    }

    const { max_hit_points, current_hit_points, temp_hit_points } = character;

    return (
        <div className="w-full h-full">
            <HealthBarClient max_hit_points={max_hit_points} current_hit_points={current_hit_points} temp_hit_points={temp_hit_points} updateCurrentHealth={updateCurrentHealth} updateMaxHealth={updateTotalHealth} updateTempHealth={updateTempHealth} />
        </div>
    );
};

export default HealthBarServer;
