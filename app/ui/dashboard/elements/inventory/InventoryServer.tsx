'use server'

import { InventoryItem } from '@prisma/client';
import InventoryClient from './InventoryClient';
import { nanoid } from 'nanoid';
import { prisma } from '@/lib/prisma';

const InventoryServer = async ({ character_id }: { character_id: string }) => {
    const items: InventoryItem[] = await prisma.inventoryItem.findMany({ where: { character_id }, orderBy: { i: 'asc' } });

    const backpackCapacity = (await prisma.character.findFirst({ where: { character_id }, select: { backpack_capacity: true } }))!.backpack_capacity;

    async function updateIndex(items: { item_id: string, i: number, slot: string }[]) {
        'use server'
        for (let i = 0; i < items.length; i++) {
            await prisma.inventoryItem.updateMany({
                where: { item_id: items[i].item_id },
                data: { i: i, slot: items[i].slot }
            });
        }
    }

    async function createItem(item: InventoryItem): Promise<string> {
        'use server'

        const itemId = nanoid(10);
        await prisma.inventoryItem.create({
            data: {
                item_id: itemId,
                character_id: character_id,
                i: item.i,
                slot: item.slot,
                item_name: item.item_name,
                description: item.description,
                weight: item.weight,
                category: item.category,
                magic: item.magic,
                quantity: item.quantity
            }
        });
        return itemId;
    }

    async function updateItem(item: InventoryItem) {
        'use server'
        await prisma.inventoryItem.updateMany({
            where: { item_id: item.item_id },
            data: {
                item_name: item.item_name,
                description: item.description,
                weight: item.weight,
                category: item.category,
                magic: item.magic,
                quantity: item.quantity
            }
        });
    }

    async function deleteItem(item_id: string) {
        'use server'
        await prisma.inventoryItem.deleteMany({ where: { item_id } });
    }

    async function updateBackpackCapacity(capacity: number) {
        'use server'
        await prisma.character.updateMany({
            where: { character_id },
            data: { backpack_capacity: capacity }
        });
    }

    return (
        <div className="inventory -z-50">
            <InventoryClient initialItems={items} initialBackpackCapacity={backpackCapacity} createItem={createItem} updateItem={updateItem} deleteItem={deleteItem} updateIndex={updateIndex} updateBackpackCapacity={updateBackpackCapacity} />
        </div>
    );
};

export default InventoryServer;
