import React from 'react';
import LevelupClient from './LevelupClient';
import { getSpellSlots, SpellSlotWithoutCharacterID, updateSpellSlots } from '../spellslots/helper';
import { prisma } from '@/lib/prisma';

export type LevelUpCharacter = {
    max_hit_points: number,
    armor_class: number,
    strength: number,
    dexterity: number,
    load_capacity: number,
    constitution: number,
    intelligence: number,
    wisdom: number,
    charisma: number,
    level: number
}

const LevelupServer = async ({ character_id }: { character_id: string }) => {
    const character = (await prisma.character.findFirst({
        where: { character_id },
        select: {
            max_hit_points: true,
            armor_class: true,
            strength: true,
            dexterity: true,
            load_capacity: true,
            constitution: true,
            intelligence: true,
            wisdom: true,
            charisma: true,
            level: true
        }
    }))!;
    const spellSlots = (await getSpellSlots(character_id));

    async function levelup(character: LevelUpCharacter, spellSlots: SpellSlotWithoutCharacterID[]) {
        'use server'
        const newLoadCapacity = 15 * character.strength;
        await prisma.character.update({
            where: { character_id: character_id },
            data: {
                max_hit_points: character.max_hit_points,
                current_hit_points: character.max_hit_points,
                temp_hit_points: 0,
                armor_class: character.armor_class,
                strength: character.strength,
                load_capacity: newLoadCapacity > character.load_capacity ? newLoadCapacity : character.load_capacity,
                dexterity: character.dexterity,
                constitution: character.constitution,
                intelligence: character.intelligence,
                wisdom: character.wisdom,
                charisma: character.charisma,
                level: character.level
            }
        });
        await updateSpellSlots(character_id, spellSlots);
    }

    return (
        <LevelupClient character={character} spellSlots={spellSlots} levelup={levelup} />
    );
};

export default LevelupServer;