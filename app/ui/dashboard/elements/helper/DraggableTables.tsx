'use client'

import React, { useState, DragEvent } from 'react';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GripVertical, Ham, PencilRuler, Pickaxe, Shield, Sword } from 'lucide-react';
import { InventoryItem } from '@/app/lib/definitions';


// Define type for table and row structure

type TableProps = {
  id: number;
  name?: string;
  rows: InventoryItem[];
};

const DraggableTables = ({ initialItems }: { initialItems: InventoryItem[] }) => {

  function formatInitialItemstoTableData(initialItems: InventoryItem[]) {
    const tableData: TableProps[] = [];
    tableData.push({ id: 1, name: "Equiped", rows: initialItems.filter(i => i.slot == "eq") });
    tableData.push({ id: 2, name: "On Body", rows: initialItems.filter(i => i.slot == "bd") });
    tableData.push({ id: 3, name: "Backpack", rows: initialItems.filter(i => i.slot == "bp") });
    return tableData;
  }

  const [tables, setTables] = useState<TableProps[]>(formatInitialItemstoTableData(initialItems));


  const [draggedRow, setDraggedRow] = useState<{ tableId: number; rowIndex: number } | null>(null);
  const [draggedOverTableId, setDraggedOverTableId] = useState<number | null>(null);
  const [draggedOverRowIndex, setDraggedOverRowIndex] = useState<number | null>(null);

  const handleDragStart = (e: DragEvent<HTMLSpanElement>, tableId: number, rowIndex: number) => {
    console.log('Drag start', tableId, rowIndex);
    setDraggedRow({ tableId, rowIndex });
    // Set the drag image to the entire row
    const rowElement = e.currentTarget.closest('tr') as HTMLTableRowElement;
    console.log('rowElement', rowElement);
    if (rowElement) {
      e.dataTransfer.setDragImage(rowElement, rowElement.clientWidth - 30, 0);
      e.dataTransfer.effectAllowed = 'move';
    }
    e.stopPropagation(); // Prevent row drag
  };

  const handleDragOver = (e: DragEvent<HTMLTableElement>, targetTableId: number) => {
    e.preventDefault();
    console.log('Drag over', e.target);
    setDraggedOverTableId(targetTableId);
    setDraggedOverRowIndex(parseInt(((e.target as HTMLTableCellElement)).id));
  };

  const handleDrop = (e: DragEvent<HTMLTableElement>, targetTableId: number) => {
    e.preventDefault();
    console.log('Drop', e.target);
    if (!draggedRow) return;

    const { tableId: sourceTableId, rowIndex: sourceRowIndex } = draggedRow;

    const targetTable = tables.find((table) => table.id === targetTableId);
    if (!targetTable) return;
    const targetIndex = parseInt(((e.target as HTMLTableCellElement)).id);
    console.log('targetIndex', targetIndex);


    // If dropping within the same table
    if (sourceTableId === targetTableId) {
      const table = tables.find((t) => t.id === sourceTableId);
      if (!table) return;
      // Calculate new position for the row
      const updatedRows = [...table.rows];

      // Remove dragged row and insert it at the new position
      const [movedRow] = updatedRows.splice(sourceRowIndex, 1);
      updatedRows.splice(Math.max(0, targetIndex), 0, movedRow);

      const updatedTables = tables.map((t) => {
        if (t.id === sourceTableId) {
          return { ...t, rows: updatedRows };
        }
        return t;
      });

      setTables(updatedTables);
    } else {

      // Handle drop between different tables
      const sourceTable = tables.find((table) => table.id === sourceTableId);
      if (!sourceTable) return;

      const sourceRow = sourceTable.rows[sourceRowIndex];
      const updatedSourceRows = sourceTable.rows.filter((_, index) => index !== sourceRowIndex);

      // Insert the row into the target table at the specified index
      const updatedTargetRows = [...targetTable.rows];
      updatedTargetRows.splice(targetIndex + 1, 0, sourceRow);

      // Update the state with new tables data
      const updatedTables = tables.map((table) => {
        if (table.id === sourceTableId) {
          return { ...table, rows: updatedSourceRows };
        } else if (table.id === targetTableId) {
          return { ...table, rows: updatedTargetRows };
        }
        return table;
      });

      setTables(updatedTables);
    }

    setDraggedRow(null);
    setDraggedOverTableId(null);
  };

  return (
    <div>
      {tables.map((table) => (
        <div>
          <h3 className='text-text text-lg bg-main border-y-2 px-4 border-black font-medium'>{table.name}</h3>
          <Table
            id='-1'
            key={table.id}
            onDragOver={(e) => handleDragOver(e, table.id)}
            onDrop={(e) => handleDrop(e, table.id)}
          >
            <TableHeader id='-1'>
              <TableRow id='-1' className={`${(draggedOverTableId === table.id && draggedOverRowIndex === -1) ? '!bg-main/20' : ''}`}>
                <TableHead id='-1' className="w-[100px]">Name</TableHead>
                <TableHead id='-1' >Description</TableHead>
                <TableHead id='-1' >Ability</TableHead>
                <TableHead id='-1' >Magic</TableHead>
                <TableHead id='-1' >Weight</TableHead>
                <TableHead id='-1' >Quantity</TableHead>
                <TableHead id='-1' className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.map((row, index) => (
                <TableRow
                  key={index}
                  className={`p-2 transition-all ${(draggedOverTableId === table.id && (draggedOverRowIndex === index || draggedOverRowIndex === -1)) ? '!bg-main/20' : ''} ${draggedRow && draggedRow.tableId === table.id && draggedRow.rowIndex === index ? '!bg-mainAccent/30' : ''}`}
                >
                  <TableCell className="font-base flex gap-2">{selectIcon(row.category)} {row.item_name}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.ability}</TableCell>
                  <TableCell>{row.magic}</TableCell>
                  <TableCell>{row.weight} kg</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell id={index.toString()} className=' flex flex-row-reverse'>
                    <div id={index.toString()} onDragStart={(e) => handleDragStart(e, table.id, index)}
                      className='cursor-move h-6 w-6' draggable>
                      <div className='absolute'>
                        <div className='absolute top-0 h-7 w-6 z-10' id={index.toString()} />
                        <GripVertical className='absolute top-0 z-0' />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {table.name === 'Backpack' &&
              <TableFooter id='-1'>
                <TableRow id='-1'>
                  <TableCell id='-1' colSpan={6}>Total Weight</TableCell>
                  <TableCell id='-1' className="text-right">87%</TableCell>
                </TableRow>
              </TableFooter>
            }
          </Table>
        </div>
      ))}
    </div>
  );
};

export function selectIcon(category: string) {
  switch (category) {
    // Weapons
    case 'W':
      return <Sword />;
    // Armor
    case 'A':
      return <Shield />;
    // Consumables
    case 'C':
      return <Ham />;
    // Tools
    case 'T':
      return <Pickaxe />;
    // Default
    default:
      return <PencilRuler />;
  }
}

export default DraggableTables;
