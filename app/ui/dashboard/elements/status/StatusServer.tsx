'use server'

import React from 'react';
import StatusClient from './StatusClient';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()


const StatusServer = async ({ character_id }: { character_id: string }) => {
    const character = await prisma.character.findFirst({
        where: { character_id },
        select: {
            name: true,
            portrait_url: true,
            inspiration: true,
            current_hit_points: true,
            max_hit_points: true,
            backpack_capacity: true,
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
    const inventory: any = await prisma.inventoryItem.aggregate({
        _sum: {
            weight: true,
            quantity: true,
        },
        where: {
            character_id: character_id,
        },
    });
    const inventoryWeight = inventory._sum.weight * inventory._sum.quantity;
    const currentWeight = coinsWeight + inventoryWeight;


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
            weight={{ current: currentWeight, max: character.backpack_capacity }}
            spell_slots={spellSlots}
            conditions={character.CharacterInfo[0].conditions!}
        />
    );
};

export default StatusServer;