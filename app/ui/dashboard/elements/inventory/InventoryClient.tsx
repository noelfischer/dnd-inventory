'use client';

import React, { useState } from 'react';
import { InventoryItem } from '@/app/lib/definitions';
import { Ham, PencilRuler, Pickaxe, Shield, Sparkles, Sword } from 'lucide-react';
import DraggableTables, { TableProps } from '../helper/DraggableTables';
import { TableRow, TableCell, TableHead, TableHeader } from '@/components/ui/table';
import NewItem from './NewItem';
import EditItem from './EditItem';
import { resetServerContext } from 'react-beautiful-dnd';
import { cn } from '@/lib/utils';

type Props = {
    initialItems: InventoryItem[];
    createItem: (item: InventoryItem) => Promise<string>;
    updateItem: (item: InventoryItem) => void;
    deleteItem: (item_id: string) => void;
    updateIndex: (items: { item_id: string, i: number, slot: string }[]) => void;
};

const InventoryClient = ({ initialItems, createItem, updateItem, deleteItem, updateIndex }: Props) => {

    function formatInitialItemstoTableData(initialItems: InventoryItem[]): TableProps[] {
        return [
            { id: 1, name: "eq", rows: initialItems.filter(i => i.slot == "eq").sort((a, b) => a.i - b.i) },
            { id: 2, name: "bd", rows: initialItems.filter(i => i.slot == "bd").sort((a, b) => a.i - b.i) },
            { id: 3, name: "bp", rows: initialItems.filter(i => i.slot == "bp").sort((a, b) => a.i - b.i) },
        ];
    }

    const [tables, setTables] = useState<TableProps[]>(formatInitialItemstoTableData(initialItems));

    async function handleCreate(formData: FormData) {

        const allTablesRowsLength = tables.map(table => table.rows.length).reduce((acc, curr) => acc + curr);
        const newItem: InventoryItem = {
            item_id: '0',
            character_id: '0',
            i: allTablesRowsLength,
            slot: formData.get('slot') as string,
            item_name: formData.get('item_name') as string,
            description: formData.get('description') as string,
            ability: '',
            weight: parseFloat(formData.get('weight') as string),
            category: formData.get('category') as string,
            magic: formData.get('magic') === 'on',
            quantity: parseInt(formData.get('quantity') as string)
        }
        const item_id = await createItem(newItem);
        newItem.item_id = item_id;

        const table = tables.find(table => table.name === newItem.slot);
        table?.rows.push(newItem);
        setTables([...tables]);
    }

    async function handleUpdate(item: InventoryItem, formData: FormData) {
        const newItem: InventoryItem = {
            item_id: item.item_id,
            character_id: item.character_id,
            i: item.i,
            slot: formData.get('slot') as string,
            item_name: formData.get('item_name') as string,
            description: formData.get('description') as string,
            ability: item.ability,
            weight: parseFloat(formData.get('weight') as string),
            category: formData.get('category') as string,
            magic: formData.get('magic') === 'on',
            quantity: parseInt(formData.get('quantity') as string)
        }
        tables.forEach(table => {
            table.rows.forEach((row, index) => {
                if (row.item_id === item.item_id) {
                    table.rows[index] = newItem;
                }
            });
        });

        setTables([...tables]);

        await updateItem(newItem);
    }

    async function handleDelete(itemid: string) {
        tables.forEach(table => {
            const newRows = table.rows.filter(row => row.item_id !== itemid);
            table.rows = newRows;
        });
        setTables([...tables]);
        await deleteItem(itemid);

    }

    const headerContent = () => {
        return (
            <>
                <colgroup>
                    <col className="w-auto" />
                    <col className="w-auto" />
                    <col className="w-6 whitespace-nowrap" />
                    <col className="w-6 whitespace-nowrap" />
                    <col className="w-6 whitespace-nowrap" />
                </colgroup>
                <TableHeader id='-1'>
                    <TableRow id='-1'>
                        <TableHead id='-1' className="w-[180px]">Name</TableHead>
                        <TableHead id='-1' className='hidden sm:inline'>Description</TableHead>
                        <TableHead id='-1'>Weight</TableHead>
                        <TableHead id='-1'>Quantity</TableHead>
                        <TableHead id='-1' className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
            </>
        )
    };

    const renderRow = (row: InventoryItem, index: number, isDragging: boolean, dragHandler: React.ReactNode) => {
        return (
            <>
                <TableCell className="whitespace-nowrap font-base flex gap-2 items-center">{selectIcon(row.category)} {row.item_name} {row.magic && <Sparkles className='-ml-2 pb-2 text-main' />}</TableCell>
                <TableCell className={cn((isDragging ? 'grow' : ''), 'hidden sm:table-cell')}>{row.description}</TableCell>
                <TableCell>{row.weight} lb.</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell id={index.toString()} className=' flex flex-row-reverse'>
                    {dragHandler}
                    <EditItem item={row} updateItem={handleUpdate} deleteItem={handleDelete} />
                </TableCell>
            </>
        )
    };

    const footerContent = (table: TableProps) => {
        if (table.name === 'bp') {
            return (
                <>
                    <TableCell>Total Weight</TableCell>
                    <TableCell className="text-right" colSpan={100}>87%</TableCell>
                </>
            );
        }
        return null;
    };

    resetServerContext();

    return (
        <div>
            <DraggableTables
                tableData={tables}
                updateIndex={updateIndex}
                headerContent={headerContent}
                renderRow={renderRow}
                footerContent={footerContent}
            />

            <NewItem className='w-auto m-4' createItem={handleCreate} />
        </div>
    );
};

export function selectIcon(category: string) {
    switch (category) {
        // Weapons
        case 'W':
            return <Sword className='min-w-6 min-h-6' />;
        // Armor
        case 'A':
            return <Shield className='min-w-6 min-h-6' />;
        // Consumables
        case 'C':
            return <Ham className='min-w-6 min-h-6' />;
        // Tools
        case 'T':
            return <Pickaxe className='min-w-6 min-h-6' />;
        // Default
        default:
            return <PencilRuler className='min-w-6 min-h-6' />;
    }
}

export default InventoryClient;
