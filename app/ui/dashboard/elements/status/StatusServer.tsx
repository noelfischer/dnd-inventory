'use server'

import React from 'react';
import StatusClient from './StatusClient';
import { sql } from '@vercel/postgres';

const StatusServer = async ({ character_id }: { character_id: string }) => {
    const combinedData = await sql<{
        name: string;
        portrait_url: string;
        inspiration: number;
        current_hit_points: number;
        max_hit_points: number;
        backpack_capacity: number;
        current_weight: string;
        conditions: string;
    }>`
        SELECT c.name, c.portrait_url, c.inspiration, c.current_hit_points, c.max_hit_points, 
               c.backpack_capacity, 
               COALESCE(SUM(i.weight), 0) AS current_weight, 
               ci.conditions 
        FROM Characters c
        LEFT JOIN Inventory i ON c.character_id = i.character_id
        LEFT JOIN CharacterInfos ci ON c.character_id = ci.character_id
        WHERE c.character_id = ${character_id}
        GROUP BY c.name, c.portrait_url, c.inspiration, c.current_hit_points, c.max_hit_points, 
                 c.backpack_capacity, ci.conditions;
    `;

    // Handle potential missing data gracefully
    if (!combinedData.rows.length) {
        throw new Error(`Character with ID ${character_id} not found.`);
    }

    const character = combinedData.rows[0];

    // Fetch spell slots and ensure all levels are present
    const spellData = await sql<{ spell_level: number, casts_remaining: number }>`
        SELECT spell_level, COALESCE(casts_remaining, 0) AS casts_remaining 
        FROM SpellSlots
        WHERE character_id = ${character_id}
        ORDER BY spell_level;
    `;

    // Ensure we have entries for all spell levels (0–9)
    const spellSlots = Array.from({ length: 10 }, (_, i) =>
        spellData.rows.find(slot => slot.spell_level === i) || { spell_level: i, casts_remaining: 0 }
    );

    // Return the client-side component with the fetched data
    return (
        <StatusClient
            imgLink={character.portrait_url}
            name={character.name}
            inspiration={character.inspiration}
            health={{ current: character.current_hit_points, max: character.max_hit_points }}
            weight={{ current: parseFloat(character.current_weight), max: character.backpack_capacity }}
            spell_slots={spellSlots}
            conditions={character.conditions}
        />
    );
};

export default StatusServer;