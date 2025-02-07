'use server'

import React from 'react';
import StatusClient from './StatusClient';
import { prisma } from '@/lib/prisma';

const StatusServer = async ({ character_id }: { character_id: string }) => {
    const character = await prisma.character.findFirst({
        where: { character_id },
        select: {
            name: true,
            portrait_url: true,
            inspiration: true,
            current_hit_points: true,
            max_hit_points: true,
            load_capacity: true,
            CharacterInfo: {
                select: {
                    conditions: true
                }
            }
        }
    });
    if (!character) return <></>;

    const currencyData = await prisma.currency.findFirst({ where: { character_id }, select: { platin: true, gold: true, silver: true, copper: true } });
    const coinsWeight: number = (currencyData!.platin + currencyData!.gold + currencyData!.silver + currencyData!.copper) * 0.02;
    const inventoryItems = await prisma.inventoryItem.findMany({
        where: { character_id: character_id },
        select: { weight: true, quantity: true },
    });

    const inventoryWeight = inventoryItems.reduce((sum, item) => sum + item.weight * item.quantity, 0);
    const currentWeight = +(coinsWeight + inventoryWeight).toFixed(2);


    // Fetch spell slots and ensure all levels are present
    const spellData = await prisma.spellSlot.findMany({ where: { character_id }, select: { spell_level: true, casts_remaining: true }, orderBy: { spell_level: 'asc' } });

    // Ensure we have entries for all spell levels (0–9)
    const spellSlots = Array.from({ length: 10 }, (_, i) =>
        spellData.find(slot => slot.spell_level === i) || { spell_level: i, casts_remaining: 0 }
    );

    // Return the client-side component with the fetched data
    return (
        <StatusClient
            imgLink={character.portrait_url || ""}
            name={character.name}
            inspiration={character.inspiration}
            health={{ current: character.current_hit_points, max: character.max_hit_points }}
            weight={{ current: currentWeight, max: character.load_capacity }}
            spell_slots={spellSlots}
            conditions={character.CharacterInfo[0].conditions!}
        />
    );
};

export default StatusServer;