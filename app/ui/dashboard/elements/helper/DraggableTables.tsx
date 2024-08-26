'use client'

import React, { useState, DragEvent } from 'react';
import { Table as UiTable, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';


// Define type for table and row structure
type Table = {
  id: number;
  rows: string[];
};

const DraggableTables = () => {
  const [tables, setTables] = useState<Table[]>([
    { id: 1, rows: ['Row 1', 'Row 2', 'Row 3'] },
    { id: 2, rows: ['Row A', 'Row B', 'Row C'] },
  ]);


  const [draggedRow, setDraggedRow] = useState<{ tableId: number; rowIndex: number } | null>(null);
  const [draggedOverTableId, setDraggedOverTableId] = useState<number | null>(null);
  const [draggedOverRowIndex, setDraggedOverRowIndex] = useState<number | null>(null);

  const handleDragStart = (e: DragEvent<HTMLTableRowElement>, tableId: number, rowIndex: number) => {
    setDraggedRow({ tableId, rowIndex });
  };

  const handleDragOver = (e: DragEvent<HTMLTableElement>, targetTableId: number) => {
    e.preventDefault();
    console.log('Drag over', e.target);
    setDraggedOverTableId(targetTableId);
    setDraggedOverRowIndex(parseInt(((e.target as HTMLTableRowElement)).id));
  };

  const handleDrop = (e: DragEvent<HTMLTableElement>, targetTableId: number) => {
    e.preventDefault();
    console.log('Drop', e.target);
    if (!draggedRow) return;

    const { tableId: sourceTableId, rowIndex: sourceRowIndex } = draggedRow;

    const targetTable = tables.find((table) => table.id === targetTableId);
    if (!targetTable) return;
    const targetIndex = parseInt(((e.target as HTMLTableRowElement)).id);
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
          <h3 className='text-text text-lg bg-main border-y-2 px-4 border-black font-medium'>Table {table.id}</h3>
          <UiTable
            key={table.id}
            onDragOver={(e) => handleDragOver(e, table.id)}
            onDrop={(e) => handleDrop(e, table.id)}
          >
            <TableHeader>
              <TableRow className={`${(draggedOverTableId === table.id && draggedOverRowIndex === -1) ? '!bg-main/20' : ''}`}>
                <TableHead id='-1'>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.map((row, index) => (
                <TableRow
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, table.id, index)}
                  className={`p-2 cursor-move ${(draggedOverTableId === table.id && (draggedOverRowIndex === index || draggedOverRowIndex === -1)) ? '!bg-main/20' : ''} ${draggedRow && draggedRow.tableId === table.id && draggedRow.rowIndex === index ? '!bg-mainAccent/30' : ''}`}
                >
                  <TableCell id={index.toString()}>{row}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </UiTable>
        </div>
      ))}
    </div>
  );
};

export default DraggableTables;
