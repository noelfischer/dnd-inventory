"use client";

import React from 'react';
import { Ham, PencilRuler, Pickaxe, Shield, Sword, Watch } from 'lucide-react';
import { TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import OnLeaveInput from '../helper/OnLeaveInput';
import { Item } from './helper';



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
        // Wearables
        case 'B':
            return <Watch className='min-w-6 min-h-6' />;
        // Default
        default:
            return <PencilRuler className='min-w-6 min-h-6' />;
    }
}

export const headerContent = () => {
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
                    <TableHead id='-1' className='hidden sm:table-cell'>Description</TableHead>
                    <TableHead id='-1'>Weight</TableHead>
                    <TableHead id='-1'>Quantity</TableHead>
                    <TableHead id='-1' className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
        </>
    )
};
