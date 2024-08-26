'use client'

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Table as UiTable, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Define type for table and row structure
type Table = {
  id: number;
  rows: string[];
};

// Function to reorder rows within the same table
const reorder = (list: string[], startIndex: number, endIndex: number): string[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Function to move rows between different tables
const move = (
  source: string[],
  destination: string[],
  droppableSource: { index: number },
  droppableDestination: { index: number }
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);

  return {
    sourceClone,
    destClone,
  };
};

const DraggableTablesDnd = () => {
  const [tables, setTables] = useState<Table[]>([
    { id: 1, rows: ['Row 1', 'Row 2', 'Row 3'] },
    { id: 2, rows: ['Row A', 'Row B', 'Row C'] },
  ]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // If dropped outside the list
    if (!destination) {
      return;
    }

    const sourceTableId = parseInt(source.droppableId);
    const destinationTableId = parseInt(destination.droppableId);

    if (sourceTableId === destinationTableId) {
      // Reorder rows within the same table
      const table = tables.find((t) => t.id === sourceTableId);
      if (!table) return;

      const updatedRows = reorder(table.rows, source.index, destination.index);
      const updatedTables = tables.map((t) =>
        t.id === sourceTableId ? { ...t, rows: updatedRows } : t
      );

      setTables(updatedTables);
    } else {
      // Move rows between different tables
      const sourceTable = tables.find((t) => t.id === sourceTableId);
      const destinationTable = tables.find((t) => t.id === destinationTableId);

      if (!sourceTable || !destinationTable) return;

      const { sourceClone, destClone } = move(
        sourceTable.rows,
        destinationTable.rows,
        source,
        destination
      );

      const updatedTables = tables.map((t) => {
        if (t.id === sourceTableId) {
          return { ...t, rows: sourceClone };
        } else if (t.id === destinationTableId) {
          return { ...t, rows: destClone };
        }
        return t;
      });

      setTables(updatedTables);
    }
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        {tables.map((table) => (
          <div key={table.id}>
            <h3 className='text-text text-lg bg-main border-y-2 px-4 border-black font-medium'>Table {table.id}</h3>
            <Droppable droppableId={table.id.toString()} direction="vertical">
              {(provided: any, snapshot: any) => (
                <UiTable
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {table.rows.map((row, index) => (
                      <Draggable key={row} draggableId={row} index={index}>
                        {(provided: any, snapshot: any) => {
                          if (snapshot.isDragging) {
                            provided.draggableProps.style.left = "inherit";
                            provided.draggableProps.style.top = "inherit";
                         }
                          return (
                            <TableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${snapshot.isDragging ? '!bg-mainAccent/30' : ''}`}
                            >
                              <TableCell>{row}</TableCell>
                            </TableRow>
                          )
                        }}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableBody>
                </UiTable>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default DraggableTablesDnd;
