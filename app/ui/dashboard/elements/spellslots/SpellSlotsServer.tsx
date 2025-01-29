'use server'

import { nanoid } from "nanoid";
import SpellSlotsClient from "./SpellSlotsClient";
import { PrismaClient, SpellSlot } from "@prisma/client";

const prisma = new PrismaClient()


const SpellSlotsServer = async ({ character_id }: { character_id: string }) => {
    const spellSlots = await prisma.spellSlot.findMany({ where: { character_id } });
    for (let i = 0; i <= 10; i++) {
        const slot = spellSlots.find(slot => slot.spell_level === i);
        if (!slot) {
            spellSlots.push({
                spell_slot_id: nanoid(10),
                character_id: character_id,
                spell_level: i,
                total_casts: 0,
                casts_remaining: 0,
            });
        }
    }

    async function updateRemainingCastsServer(character_id: string, spellSlots: SpellSlot) {
        'use server'
        const existingSlot = await prisma.spellSlot.findMany({ where: { spell_slot_id: spellSlots.spell_slot_id }, select: { spell_slot_id: true } });
        if (existingSlot.length < 1) {
            await prisma.spellSlot.create({
                data: {
                    spell_slot_id: spellSlots.spell_slot_id,
                    character_id: character_id,
                    spell_level: spellSlots.spell_level,
                    total_casts: spellSlots.total_casts,
                    casts_remaining: spellSlots.casts_remaining
                }
            });
        } else {
            await prisma.spellSlot.update({ where: { spell_slot_id: spellSlots.spell_slot_id }, data: { casts_remaining: spellSlots.casts_remaining } });
        }
    }

    async function updateLevelDescriptionServer(character_id: string, spellSlots: SpellSlot) {
        'use server'
        const existingSlot = await prisma.spellSlot.findMany({ where: { spell_slot_id: spellSlots.spell_slot_id }, select: { spell_slot_id: true } });
        if (existingSlot.length < 1) {
            await prisma.spellSlot.create({
                data: {
                    spell_slot_id: spellSlots.spell_slot_id,
                    character_id: character_id,
                    spell_level: spellSlots.spell_level,
                    total_casts: spellSlots.total_casts,
                    casts_remaining: spellSlots.casts_remaining
                }
            });
        } else {
            await prisma.spellSlot.update({ where: { spell_slot_id: spellSlots.spell_slot_id }, data: { total_casts: spellSlots.total_casts } });
        }
    }

    return (
        <div>
            <SpellSlotsClient spell_slots={spellSlots} character_id={character_id} updateRemainingCasts={updateRemainingCastsServer} updateLevelDescription={updateLevelDescriptionServer} />
        </div>
    );
};

export default SpellSlotsServer;