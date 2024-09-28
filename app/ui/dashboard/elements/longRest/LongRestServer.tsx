import React from 'react';
import LongRestClient from './LongRestClient';
import { sql } from '@vercel/postgres';

const LongRestServer = async ({ character_id }: { character_id: string }) => {

    async function longRest() {
        'use server'
        await sql`UPDATE Characters SET current_hit_points = max_hit_points, temp_hit_points = 0 WHERE character_id = ${character_id}`;
        await sql`UPDATE SpellSlots SET casts_remaining = total_casts WHERE character_id = ${character_id}`;
    }

    return (
        <LongRestClient longRest={longRest} />
    );
};

export default LongRestServer;