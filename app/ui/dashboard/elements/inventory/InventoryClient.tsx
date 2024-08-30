'use client';

import React, { useState } from 'react';
import { InventoryItem } from '@/app/lib/definitions';
import { Ham, Pencil, PencilRuler, Pickaxe, Shield, Sparkles, Sword } from 'lucide-react';
import Button from '@/components/Button';
import DraggableTables from '../helper/DraggableTables';
import { TableRow, TableCell, TableHead, TableHeader } from '@/components/ui/table';

type TableProps = {
    id: number;
    name?: string;
    rows: InventoryItem[];
};

const InventoryClient = ({ initialItems, updateIndex }: { initialItems: InventoryItem[], updateIndex: (items: { item_id: string, i: number, slot: string }[]) => void }) => {

    function formatInitialItemstoTableData(initialItems: InventoryItem[]): TableProps[] {
        return [
            { id: 1, name: "Equipped", rows: initialItems.filter(i => i.slot == "eq").sort((a, b) => a.i - b.i) },
            { id: 2, name: "On Body", rows: initialItems.filter(i => i.slot == "bd").sort((a, b) => a.i - b.i) },
            { id: 3, name: "Backpack", rows: initialItems.filter(i => i.slot == "bp").sort((a, b) => a.i - b.i) },
        ];
    }

    const [tables, setTables] = useState<TableProps[]>(formatInitialItemstoTableData(initialItems));

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
                        <TableHead id='-1'>Description</TableHead>
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
                <TableCell className="whitespace-nowrap font-base flex gap-2 items-center">{selectIcon(row.category)} {row.item_name} {row.magic && <Sparkles />}</TableCell>
                <TableCell className={isDragging ? 'grow' : ''}>{row.description}</TableCell>
                <TableCell>{row.weight} kg</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell id={index.toString()} className=' flex flex-row-reverse'>
                    {dragHandler}
                    <Pencil id={index.toString()} className='cursor-pointer rounded-lg h-[28px] w-[28px] -my-0.5 mr-2  p-1 hover:bg-zinc-500/20' />
                </TableCell>
            </>
        )
    };

    const footerContent = (table: TableProps) => {
        if (table.name === 'Backpack') {
            return (
                <>
                    <TableCell id='-1' colSpan={4}>Total Weight</TableCell>
                    <TableCell id='-1' className="text-right">87%</TableCell>
                </>
            );
        }
        return null;
    };

    return (
        <div>
            <DraggableTables
                tableData={tables}
                updateIndex={updateIndex}
                headerContent={headerContent}
                renderRow={renderRow}
                footerContent={footerContent}
            />
            <Button className='w-auto m-4'>Add Item</Button>
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
