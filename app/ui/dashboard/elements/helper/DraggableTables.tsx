// DraggableTables.tsx
'use client';

import React, { useState, DragEvent } from 'react';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InventoryItem } from '@/app/lib/definitions';

type TableProps = {
  id: number;
  name?: string;
  rows: any[];
};

type DraggableTablesProps = {
  tableData: TableProps[];
  updateIndex: (items: { item_id: string; i: number; slot: string }[]) => void;
  headerContent: () => React.ReactNode;
  renderRow: (row: InventoryItem, index: number, tableId: number, handleDragStart: Function,
    draggedOverTableId: number | null, draggedOverRowIndex: number | null, draggedRow: { tableId: number, rowIndex: number } | null) => React.ReactNode;
  footerContent?: (table: TableProps) => React.ReactNode;
};

const DraggableTables: React.FC<DraggableTablesProps> = ({
  tableData,
  updateIndex,
  headerContent,
  renderRow,
  footerContent
}) => {
  const [tables, setTables] = useState<TableProps[]>(tableData);
  const [draggedRow, setDraggedRow] = useState<{ tableId: number; rowIndex: number } | null>(null);
  const [draggedOverTableId, setDraggedOverTableId] = useState<number | null>(null);
  const [draggedOverRowIndex, setDraggedOverRowIndex] = useState<number | null>(null);

  const handleDragStart = (e: DragEvent<HTMLSpanElement>, tableId: number, rowIndex: number) => {
    setDraggedRow({ tableId, rowIndex });
    const rowElement = e.currentTarget.closest('tr') as HTMLTableRowElement;
    if (rowElement) {
      e.dataTransfer.setDragImage(rowElement, rowElement.clientWidth - 30, 0);
      e.dataTransfer.effectAllowed = 'move';
    }
    e.stopPropagation();
  };

  const handleDragOver = (e: DragEvent<HTMLTableElement>, targetTableId: number) => {
    e.preventDefault();
    setDraggedOverTableId(targetTableId);
    setDraggedOverRowIndex(parseInt(((e.target as HTMLTableCellElement)).id));
  };

  const handleDrop = (e: DragEvent<HTMLTableElement>, targetTableId: number) => {
    e.preventDefault();
    if (!draggedRow) return;

    const { tableId: sourceTableId, rowIndex: sourceRowIndex } = draggedRow;

    const targetTable = tables.find((table) => table.id === targetTableId);
    if (!targetTable) return;

    const targetIndex = parseInt(((e.target as HTMLTableCellElement)).id);

    if (sourceTableId === targetTableId) {
      if (sourceRowIndex === targetIndex) {
        setDraggedRow(null);
        setDraggedOverTableId(null);
        return;
      }

      const table = tables.find((t) => t.id === sourceTableId);
      if (!table) return;

      const updatedRows = [...table.rows];
      const [movedRow] = updatedRows.splice(sourceRowIndex, 1);
      updatedRows.splice(Math.max(0, targetIndex), 0, movedRow);

      const updatedTables = tables.map((t) => {
        if (t.id === sourceTableId) {
          return { ...t, rows: updatedRows };
        }
        return t;
      });

      let serverItems: { item_id: string; i: number; slot: string }[] = [];
      updatedRows.forEach((row, index) => {
        serverItems.push({ item_id: row.item_id, i: index, slot: row.slot });
      });
      updateIndex(serverItems);
      setTables(updatedTables);
    } else {
      const sourceTable = tables.find((table) => table.id === sourceTableId);
      if (!sourceTable) return;

      let sourceRow = sourceTable.rows[sourceRowIndex];
      sourceRow.slot = targetTable.name === 'Equiped' ? 'eq' : targetTable.name === 'On Body' ? 'bd' : 'bp';
      const updatedSourceRows = sourceTable.rows.filter((_, index) => index !== sourceRowIndex);

      const updatedTargetRows = [...targetTable.rows];
      updatedTargetRows.splice(targetIndex + 1, 0, sourceRow);

      let serverItems: { item_id: string; i: number; slot: string }[] = [];
      updatedTargetRows.forEach((row, index) => {
        serverItems.push({ item_id: row.item_id, i: index, slot: row.slot });
      });
      updatedSourceRows.forEach((row, index) => {
        serverItems.push({ item_id: row.item_id, i: index, slot: row.slot });
      });
      updateIndex(serverItems);

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
        <div key={table.id}>
          <h3 className='text-text text-lg bg-main border-y-2 px-4 border-black font-medium'>{table.name}</h3>
          <Table
            className='table-auto'
            id='-1'
            onDragOver={(e) => handleDragOver(e, table.id)}
            onDrop={(e) => handleDrop(e, table.id)}
          >
            {headerContent()}
            <TableBody>
              {table.rows.map((row, index) => renderRow(row, index, table.id, handleDragStart, draggedOverTableId, draggedOverRowIndex, draggedRow))}
            </TableBody>
            {footerContent && (
              <TableFooter id='-1'>
                {footerContent(table)}
              </TableFooter>
            )}
          </Table>
        </div>
      ))}
    </div>
  );
};

export default DraggableTables;