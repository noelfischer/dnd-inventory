'use client'

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Table as UiTable, TableBody, TableFooter, TableRow } from '@/components/ui/table';
import { InventoryItem } from '@/app/lib/definitions';
import { GripVertical } from 'lucide-react';

// Define type for table and row structure
export type TableProps = {
  id: number;
  name: string;
  rows: InventoryItem[];
};

type DraggableTablesProps = {
  tables: TableProps[];
  setTables: React.Dispatch<React.SetStateAction<TableProps[]>>;
  updateIndex: (items: { item_id: string; i: number; slot: string }[]) => void;
  headerContent: () => React.ReactNode;
  renderRow: (row: InventoryItem, index: number, isDragging: boolean, dragHandler: React.ReactNode) => React.ReactNode;
  footerContent?: (table: TableProps) => React.ReactNode;
};

// Function to reorder rows within the same table
const reorder = (list: InventoryItem[], startIndex: number, endIndex: number): InventoryItem[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Function to move rows between different tables
const move = (
  source: InventoryItem[],
  destination: InventoryItem[],
  droppableSource: { index: number },
  droppableDestination: { index: number },
  destinationSlot: string
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  removed.slot = destinationSlot;
  destClone.splice(droppableDestination.index, 0, removed);

  return {
    sourceClone,
    destClone,
  };
};

const DraggableTables = ({
  tables,
  setTables,
  updateIndex,
  headerContent,
  renderRow,
  footerContent
}: DraggableTablesProps) => {

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // If dropped outside the list
    if (!destination || !source || (source.droppableId == destination.droppableId && destination.index === source.index)) {
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

      // Prepare server update data
      let serverItems: { item_id: string; i: number; slot: string }[] = [];
      updatedRows.forEach((row, index) => {
        serverItems.push({ item_id: row.item_id, i: index, slot: row.slot });
      });

      // Update server with the new row order
      updateIndex(serverItems);

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
        destination,
        destinationTable.name
      );

      const updatedTables = tables.map((t) => {
        if (t.id === sourceTableId) {
          return { ...t, rows: sourceClone };
        } else if (t.id === destinationTableId) {
          return { ...t, rows: destClone };
        }
        return t;
      });

      // Prepare server update data for both source and destination tables
      let serverItems: { item_id: string; i: number; slot: string }[] = [];
      destClone.forEach((row, index) => {
        serverItems.push({ item_id: row.item_id, i: index, slot: row.slot });
      });
      sourceClone.forEach((row, index) => {
        serverItems.push({ item_id: row.item_id, i: index, slot: row.slot });
      });

      // Update server with the new row order and slots
      updateIndex(serverItems);

      setTables(updatedTables);
    }
  };

  return (
    <div id='tablebase'>
      <DragDropContext onDragEnd={onDragEnd}>
        {tables.map((table) => (
          <div key={table.id} id={"table" + table.id}>
            <h3 className='text-text text-lg bg-main border-y-2 px-4 border-black font-medium'>{table.name === "eq" ? "Equipped" : table.name === "bd" ? "On Body" : "Backpack"}</h3>
            <Droppable droppableId={table.id.toString()} direction="vertical" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={true}>
              {(provided: any, snapshot: any) => (
                <UiTable
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className='overflow-hidden'
                >
                  {headerContent()}
                  <TableBody>
                    {table.rows.map((row: InventoryItem, index) => {

                      return (
                        <Draggable key={row.item_id} draggableId={row.item_id} index={index}>
                          {(provided: any, snapshot: any) => {

                            function dragHandler() {
                              return (
                                <div {...provided.dragHandleProps} className='h-6 w-6' >
                                  <div className='absolute'>
                                    <div className='absolute top-0 h-7 w-6 z-10' />
                                    <GripVertical className='absolute top-0 z-0' />
                                  </div>
                                </div>
                              );
                            }

                            // this block is to calculate the offset of the dragged item
                            // react beautiful dnd would actually do this for you, but it's not working
                            // it is not a perfect solution, as it doesn't take into account the scroll position
                            if (snapshot.isDragging) {
                              provided.draggableProps.style.left = 0;
                              provided.draggableProps.style.top = "inherit";
                            }
                            return (
                              <TableRow
                                ref={provided.innerRef}
                                id={row.item_id}
                                {...provided.draggableProps}
                                key={row.item_id}
                                className={`${snapshot.isDragging ? 'flex !bg-mainAccent/30' : ''}`}
                              >
                                {renderRow(row, index, snapshot.isDragging, dragHandler())}
                              </TableRow>
                            )
                          }}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </TableBody>
                  {footerContent && (
                    <TableFooter>
                      <TableRow>
                        {footerContent(table)}
                      </TableRow>
                    </TableFooter>
                  )}
                </UiTable>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default DraggableTables;