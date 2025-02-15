'use server'

import React from 'react';
import LongRestClient from './LongRestClient';
import { prisma } from '@/lib/prisma';

const LongRestServer = async ({ character_id }: { character_id: string }) => {

    async function longRest(character_id: string) {
        'use server'
        const character = await prisma.character.findUnique({
            where: { character_id: character_id },
            select: { max_hit_points: true },
        });

        // Step 2: Use the retrieved value in the update
        if (character) {
            await prisma.character.update({
                where: { character_id: character_id },
                data: {
                    current_hit_points: character.max_hit_points, // Set current HP to max HP
                    temp_hit_points: 0, // Reset temp HP
                },
            });

            const spellSlots = await prisma.spellSlot.findMany({
                where: { character_id: character_id },
                select: { spell_slot_id: true, total_casts: true }, // Fetch ID and total_casts
            });

            // Step 2: Update each row with the corresponding total_casts
            const updatePromises = spellSlots.map((slot) =>
                prisma.spellSlot.update({
                    where: { spell_slot_id: slot.spell_slot_id }, // Update each spell slot by its unique ID
                    data: { casts_remaining: slot.total_casts },
                })
            );

            // Execute all updates in parallel
            await Promise.all(updatePromises);
        }
    }

    return (
        <LongRestClient longRest={longRest.bind(null, character_id)} />
    );
};

export default LongRestServer;