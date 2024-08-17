'use server'

import { SpellSlot } from "@/app/lib/definitions";
import { sql } from '@vercel/postgres';
import { nanoid } from "nanoid";
import SpellSlotsClient from "./SpellSlotsClient";

const SpellSlotsServer = async ({ character_id }: { character_id: string }) => {
    const data = await sql<SpellSlot>`SELECT spell_slot_id, spell_level, level_description, casts_remaining FROM SpellSlots WHERE character_id = ${character_id}`;
    const spellSlots = data.rows;
    for (let i = 0; i <= 10; i++) {
        const slot = spellSlots.find(slot => slot.spell_level === i);
        if (!slot) {
            spellSlots.push({
                spell_slot_id: nanoid(10),
                character_id: character_id,
                spell_level: i,
                level_description: (i === 0 ? "Ability" : (i + ".")) + " (0)",
                casts_remaining: 0,
            });
        }
    }

    async function updateRemainingCastsServer(character_id: string, spellSlots: SpellSlot) {
        'use server'
        const existingSlot = await sql<SpellSlot>`SELECT 1 FROM SpellSlots WHERE spell_slot_id = ${spellSlots.spell_slot_id}`;
        if (existingSlot.rows.length < 1) {
            await sql`INSERT INTO SpellSlots (spell_slot_id, character_id, spell_level, level_description, casts_remaining) VALUES (${spellSlots.spell_slot_id}, ${character_id}, ${spellSlots.spell_level}, ${spellSlots.level_description}, ${spellSlots.casts_remaining})`;
        } else {
            await sql`UPDATE SpellSlots SET casts_remaining = ${spellSlots.casts_remaining} WHERE spell_slot_id = ${spellSlots.spell_slot_id}`;
        }
    }

    async function updateLevelDescriptionServer(character_id: string, spellSlots: SpellSlot) {
        'use server'
        const existingSlot = await sql<SpellSlot>`SELECT 1 FROM SpellSlots WHERE spell_slot_id = ${spellSlots.spell_slot_id}`;
        if (existingSlot.rows.length < 1) {
            await sql`INSERT INTO SpellSlots (spell_slot_id, character_id, spell_level, level_description, casts_remaining) VALUES (${spellSlots.spell_slot_id}, ${character_id}, ${spellSlots.spell_level}, ${spellSlots.level_description}, ${spellSlots.casts_remaining})`;
        } else {
            await sql`UPDATE SpellSlots SET level_description = ${spellSlots.level_description} WHERE spell_slot_id = ${spellSlots.spell_slot_id}`;
        }
    }

    return (
        <div>
            <SpellSlotsClient spellSlots={spellSlots} character_id={character_id} updateRemainingCasts={updateRemainingCastsServer} updateLevelDescription={updateLevelDescriptionServer} />
        </div>
    );
};

export default SpellSlotsServer;