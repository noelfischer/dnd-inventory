'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import DraggableTables from './DraggableTables';
import { TableCell } from '@/components/ui/table';
import NewItem from './NewItem';
import EditItem from './EditItem';
import { resetServerContext } from 'react-beautiful-dnd';
import { cn } from '@/lib/utils';
import OnLeaveInput from '../helper/OnLeaveInput';
import { InventoryItem } from '@prisma/client';
import { createInventoryItem, formatInitialItemstoTableData, Item, Props, removeItemFromInventory, updateInventoryItem } from './helper';
import { headerContent, selectIcon } from './HelperComponents';
import DraggableTables2 from './DraggableTables2';

const InventoryClient = ({ initialItems, initialBackpackCapacity, createItem, updateItem, deleteItem, updateIndex, updateBackpackCapacity }: Props) => {

    const [tables, setTables] = useState<Item[]>(formatInitialItemstoTableData(initialItems));
    const [backpackCapacity, setBackpackCapacity] = useState<number>(initialBackpackCapacity);

    const backpackFilled = tables.find(table => table.name === 'bp')?.rows.map(row => row.weight * row.quantity).reduce((acc, curr) => acc + curr, 0) || 0;
    const [backpackPercentage, setBackpackPercentage] = useState<number>(+(backpackFilled / backpackCapacity * 100).toFixed(2));

    useEffect(() => {
        setBackpackPercentage(+(backpackFilled / backpackCapacity * 100).toFixed(2));
    }, [backpackFilled, initialBackpackCapacity]);

    async function handleCreate(formData: FormData) {
        const newTables = await createInventoryItem(formData, tables, createItem);
        setTables([...newTables]);
    }

    async function handleUpdate(item: InventoryItem, formData: FormData) {
        const [newTables, promise] = updateInventoryItem(item, formData, tables, updateItem);
        setTables([...newTables]);
        await promise;
    }

    async function handleDelete(itemid: string) {
        const [newTables, promise] = removeItemFromInventory(itemid, tables, deleteItem);
        setTables([...tables]);
        await promise;
    }

    function onChangeBackpackLoadCapacity(capacity: string) {
        const capacityNumber = parseInt(capacity);
        if (isNaN(capacityNumber)) return;
        updateBackpackCapacity(capacityNumber);
        setBackpackCapacity(capacityNumber);
        setBackpackPercentage(+(backpackFilled / backpackCapacity * 100).toFixed(2));
    }

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

    const footerContent = (table: Item) => {
        if (table.name === 'bp') {
            return (
                <>
                    <TableCell>Total Weight</TableCell>
                    <TableCell className="text-right" colSpan={100}><span className='pr-2'>{backpackFilled}</span> / <OnLeaveInput className='h-6 -mt-0.5' initialValue={backpackCapacity.toString()} onLeave={onChangeBackpackLoadCapacity} /><span className='mr-2'> lb. </span> | <span className='ml-3'>{isNaN(backpackPercentage) ? "0" : backpackPercentage} %</span></TableCell>
                </>
            );
        }
        return null;
    };

    resetServerContext();

    return (
        <div>
            <DraggableTables
                tables={tables}
                setTables={setTables}
                updateIndex={updateIndex}
                headerContent={headerContent}
                renderRow={renderRow}
                footerContent={footerContent}
            />

            <NewItem className='w-auto m-4' createItem={handleCreate} />
        </div>
    );
};

export default InventoryClient;
