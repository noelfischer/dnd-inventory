'use client';

import React, { useEffect, useState } from 'react';
import { GripVertical, Sparkles } from 'lucide-react';
import NewItem from './NewItem';
import EditItem from './EditItem';
import OnLeaveInput from '../helper/OnLeaveInput';
import { InventoryItem } from '@prisma/client';
import { createInventoryItem, formatInitialItemstoTableData, HandleRef, Item, Props, removeItemFromInventory, updateInventoryItem } from './helper';
import { selectIcon } from './HelperComponents';
import DraggableTables from './DraggableTables';

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


    const headerContent = () => {
        return (
            <>
                <div className="px-3 col-span-2 sm:col-span-1">Name</div>
                <div className='hidden sm:table-cell mr-3'>Description</div>
                <div className='mr-3'>Weight</div>
                <div>Quantity</div>
                <div className="text-right px-3">Actions</div>
            </>
        )
    };

    const renderRow = (row: InventoryItem, index: number) => {
        const rowContent = (ref: HandleRef) => (
            <>
                <div className="whitespace-nowrap font-base flex gap-2 items-center col-span-2 sm:col-span-1 mr-3">{selectIcon(row.category)} {row.item_name} {row.magic && <Sparkles className='-ml-2 pb-2 text-main' />}</div>
                <div className="hidden sm:table-cell">{row.description}</div>
                <div>{row.weight} lb.</div>
                <div className='sm:mr-12'>{row.quantity}</div>
                <div id={index.toString()} className='flex flex-row-reverse items-center'>
                    <div ref={ref} className='cursor-grab'>
                        <GripVertical />
                    </div>
                    <EditItem item={row} updateItem={handleUpdate} deleteItem={handleDelete} />
                </div>
            </>
        )
        // Eslint error fix
        rowContent.displayName = 'RowContent';
        return rowContent;
    };

    const footerContent = (id: string) => {
        if (id === 'bp') {
            return (
                <>
                    <div className='px-3'>Backpack Load</div>
                    <div className="text-right col-span-4 px-3"><span className='pr-2'>{backpackFilled}</span> / <OnLeaveInput className='h-6 -mt-0.5' initialValue={backpackCapacity.toString()} onLeave={onChangeBackpackLoadCapacity} /><span className='mr-2'> lb. </span> | <span className='ml-3'>{isNaN(backpackPercentage) ? "0" : backpackPercentage} %</span></div>
                </>
            );
        }
        return null;
    };

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
