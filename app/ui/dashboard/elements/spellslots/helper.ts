'use server';

import { SpellSlot } from "@prisma/client";
import { nanoid } from "nanoid";
import { prisma } from '@/lib/prisma';

export type SpellSlotWithoutCharacterID = Omit<SpellSlot, 'character_id'>;


export async function getSpellSlots(character_id: string) {
    const spellSlots = await prisma.spellSlot.findMany({ where: { character_id }, select: { spell_slot_id: true, spell_level: true, total_casts: true, casts_remaining: true } });
    for (let i = 0; i <= 10; i++) {
        const slot = spellSlots.find(slot => slot.spell_level === i);
        if (!slot) {
            spellSlots.push({
                spell_slot_id: nanoid(10),
                spell_level: i,
                total_casts: 0,
                casts_remaining: 0,
            });
        }
    }
    return spellSlots.sort((a, b) => a.spell_level - b.spell_level);
}

export async function updateRemainingCasts(character_id: string, spellSlot: SpellSlotWithoutCharacterID) {
    const existingSlot = await prisma.spellSlot.findMany({ where: { spell_slot_id: spellSlot.spell_slot_id }, select: { spell_slot_id: true } });
    if (existingSlot.length < 1) {
        await prisma.spellSlot.create({
            data: {
                spell_slot_id: spellSlot.spell_slot_id,
                character_id: character_id,
                spell_level: spellSlot.spell_level,
                total_casts: spellSlot.total_casts,
                casts_remaining: spellSlot.casts_remaining
            }
        });
    } else {
        await prisma.spellSlot.update({ where: { spell_slot_id: spellSlot.spell_slot_id }, data: { casts_remaining: spellSlot.casts_remaining } });
    }
}

export async function updateTotalCasts(character_id: string, spellSlot: SpellSlotWithoutCharacterID) {
    const existingSlot = await prisma.spellSlot.findMany({ where: { spell_slot_id: spellSlot.spell_slot_id }, select: { spell_slot_id: true } });
    if (existingSlot.length < 1) {
        await prisma.spellSlot.create({
            data: {
                spell_slot_id: spellSlot.spell_slot_id,
                character_id: character_id,
                spell_level: spellSlot.spell_level,
                total_casts: spellSlot.total_casts,
                casts_remaining: spellSlot.casts_remaining
            }
        });
    } else {
        await prisma.spellSlot.update({ where: { spell_slot_id: spellSlot.spell_slot_id }, data: { total_casts: spellSlot.total_casts } });
    }
}

export async function updateSpellSlots(character_id: string, spellSlots: SpellSlotWithoutCharacterID[]) {
    const existingSlots = await prisma.spellSlot.findMany({ where: { character_id } });
    for (const slot of spellSlots) {
        const existingSlot = existingSlots.find(s => s.spell_slot_id === slot.spell_slot_id);
        if (existingSlot) {
            // check if the slot has been updated
            if (existingSlot.total_casts !== slot.total_casts || existingSlot.casts_remaining !== slot.casts_remaining) {
                await prisma.spellSlot.update({ where: { spell_slot_id: slot.spell_slot_id }, data: { total_casts: slot.total_casts, casts_remaining: slot.casts_remaining } });
            }
        } else {
            await prisma.spellSlot.create({ data: { spell_slot_id: slot.spell_slot_id, character_id, spell_level: slot.spell_level, total_casts: slot.total_casts, casts_remaining: slot.casts_remaining } });
        }
    }
}