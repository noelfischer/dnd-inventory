'use client';

import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { useContext, useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import { Column } from './column';
import {
  isCardData,
  isCardDropTargetData,
  isColumnData,
  isDraggingACard,
  isDraggingAColumn,
  TBoard,
  TColumn,
} from './data';
import { SettingsContext } from './settings-context';
import { unsafeOverflowAutoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element';
import { bindAll } from 'bind-event-listener';
import { blockBoardPanningAttr } from './data-attributes';
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { InventoryItem } from '@prisma/client';

export function Board({ initial }: { initial: TBoard }) {
  const [data, setData] = useState(initial);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const { settings } = useContext(SettingsContext);

  useEffect(() => {
    setData(initial);
  }, [initial]);

  useEffect(() => {
    const element = scrollableRef.current;
    invariant(element);
    return combine(
      monitorForElements({
        canMonitor: isDraggingACard,
        onDrop({ source, location }) {
          const dragging = source.data;
          if (!isCardData(dragging)) {
            return;
          }

          const innerMost = location.current.dropTargets[0];

          if (!innerMost) {
            return;
          }
          const dropTargetData = innerMost.data;
          const homeColumnId = dragging.columnId;
          const homeColumnIndex = data.columns.findIndex(
            (column) => column.id === homeColumnId,
          );
          const home: TColumn | undefined = data.columns[homeColumnIndex];

          const table = data.tables.find((t) => t.name === homeColumnId);
          if (!table) { return }

          if (!home) { return; }
          const cardIndexInHome = home.cards.findIndex((card) => card.id === dragging.card.id);

          // dropping on a card
          if (isCardDropTargetData(dropTargetData)) {
            const destinationColumnIndex = data.columns.findIndex(
              (column) => column.id === dropTargetData.columnId,
            );
            const destination = data.columns[destinationColumnIndex];
            // reordering in home column
            if (home === destination) {
              const cardFinishIndex = home.cards.findIndex((card) => card.id === dropTargetData.card.id);

              // could not find cards needed
              if (cardIndexInHome === -1 || cardFinishIndex === -1) {
                return;
              }

              // no change needed
              if (cardIndexInHome === cardFinishIndex) {
                return;
              }

              // Reorder rows within the same table
              const closestEdge = extractClosestEdge(dropTargetData);

              const updatedRows = reorderWithEdge({
                axis: 'vertical',
                list: table.rows,
                startIndex: cardIndexInHome,
                indexOfTarget: cardFinishIndex,
                closestEdgeOfTarget: closestEdge,
              });

              moveCardInSameColumn(updatedRows);

              return;
            }

            // unable to find destination
            if (!destination) {
              return;
            }

            // moving card from one column to another
            const indexOfTarget = destination.cards.findIndex(
              (card) => card.id === dropTargetData.card.id,
            );

            const closestEdge = extractClosestEdge(dropTargetData);
            const finalIndex = closestEdge === 'bottom' ? indexOfTarget + 1 : indexOfTarget;
            transferCardBetweenColumns(destinationColumnIndex, destination, finalIndex);
            return;
          }

          // dropping onto a column, but not onto a card
          if (isColumnData(dropTargetData)) {
            const destinationColumnIndex = data.columns.findIndex(
              (column) => column.id === dropTargetData.column.id,
            );
            const destination = data.columns[destinationColumnIndex];

            if (!destination) {
              return;
            }

            // dropping on home
            if (home === destination) {
              const updatedRows = reorder({
                list: table.rows,
                startIndex: cardIndexInHome,
                finishIndex: home.cards.length - 1,
              });
              moveCardInSameColumn(updatedRows);
              return;
            }

            transferCardBetweenColumns(destinationColumnIndex, destination, destination.cards.length);
            return;
          }

          function moveCardInSameColumn(updatedRows: InventoryItem[]) {

            // object are the same, no change needed
            if (table?.rows.length === updatedRows.length && table.rows.every(function (value, index) { return value === updatedRows[index] })) {
              return;
            };

            const updatedTables = data.tables.map((t) => t.name === homeColumnId ? { ...t, rows: updatedRows } : t
            );

            // Prepare server update data
            let serverItems: { item_id: string; i: number; slot: string; }[] = [];
            updatedRows.forEach((row, index) => {
              serverItems.push({ item_id: row.item_id, i: index, slot: row.slot });
            });

            // Update server with the new row order
            data.updateIndex(serverItems);
            data.setTables(updatedTables);
          }

          function transferCardBetweenColumns(destinationColumnIndex: number, destination: TColumn, position: number) {
            const sourceClone = Array.from(data.tables[homeColumnIndex].rows);
            const destClone = Array.from(data.tables[destinationColumnIndex].rows);
            const [removed] = sourceClone.splice(cardIndexInHome, 1);
            removed.slot = destination.id;
            destClone.splice(position, 0, removed);

            const updatedTables = data.tables.map((t, i) => {
              if (i === homeColumnIndex) {
                return { ...t, rows: sourceClone };
              } else if (i === destinationColumnIndex) {
                return { ...t, rows: destClone };
              }
              return t;
            });

            // Prepare server update data for both source and destination tables
            let serverItems: { item_id: string; i: number; slot: string; }[] = [];
            destClone.forEach((row, index) => {
              serverItems.push({ item_id: row.item_id, i: index, slot: row.slot });
            });
            sourceClone.forEach((row, index) => {
              serverItems.push({ item_id: row.item_id, i: index, slot: row.slot });
            });
            // Update server with the new row order and slots
            data.updateIndex(serverItems);
            data.setTables(updatedTables);
          }
        },
      }),
      monitorForElements({
        canMonitor: isDraggingAColumn,
        onDrop({ source, location }) {
          const dragging = source.data;
          if (!isColumnData(dragging)) {
            return;
          }

          const innerMost = location.current.dropTargets[0];

          if (!innerMost) {
            return;
          }
          const dropTargetData = innerMost.data;

          if (!isColumnData(dropTargetData)) {
            return;
          }

          const homeIndex = data.columns.findIndex((column) => column.id === dragging.column.id);
          const destinationIndex = data.columns.findIndex(
            (column) => column.id === dropTargetData.column.id,
          );

          if (homeIndex === -1 || destinationIndex === -1) {
            return;
          }

          if (homeIndex === destinationIndex) {
            return;
          }

          const reordered = reorder({
            list: data.columns,
            startIndex: homeIndex,
            finishIndex: destinationIndex,
          });
          setData({ ...data, columns: reordered });
        },
      }),
      autoScrollForElements({
        canScroll({ source }) {
          if (!settings.isOverElementAutoScrollEnabled) {
            return false;
          }

          return isDraggingACard({ source }) || isDraggingAColumn({ source });
        },
        getConfiguration: () => ({ maxScrollSpeed: settings.boardScrollSpeed }),
        element,
      }),
      unsafeOverflowAutoScrollForElements({
        element,
        getConfiguration: () => ({ maxScrollSpeed: settings.boardScrollSpeed }),
        canScroll({ source }) {
          if (!settings.isOverElementAutoScrollEnabled) {
            return false;
          }

          if (!settings.isOverflowScrollingEnabled) {
            return false;
          }

          return isDraggingACard({ source }) || isDraggingAColumn({ source });
        },
        getOverflow() {
          return {
            forLeftEdge: {
              top: 1000,
              left: 1000,
              bottom: 1000,
            },
            forRightEdge: {
              top: 1000,
              right: 1000,
              bottom: 1000,
            },
          };
        },
      }),
    );
  }, [data, settings]);

  // Panning the board
  useEffect(() => {
    let cleanupActive: CleanupFn | null = null;
    const scrollable = scrollableRef.current;
    invariant(scrollable);

    function begin({ startX }: { startX: number }) {
      let lastX = startX;

      const cleanupEvents = bindAll(
        window,
        [
          {
            type: 'pointermove',
            listener(event) {
              const currentX = event.clientX;
              const diffX = lastX - currentX;

              lastX = currentX;
              scrollable?.scrollBy({ left: diffX });
            },
          },
          // stop panning if we see any of these events
          ...(
            [
              'pointercancel',
              'pointerup',
              'pointerdown',
              'keydown',
              'resize',
              'click',
              'visibilitychange',
            ] as const
          ).map((eventName) => ({ type: eventName, listener: () => cleanupEvents() })),
        ],
        // need to make sure we are not after the "pointerdown" on the scrollable
        // Also this is helpful to make sure we always hear about events from this point
        { capture: true },
      );

      cleanupActive = cleanupEvents;
    }

    const cleanupStart = bindAll(scrollable, [
      {
        type: 'pointerdown',
        listener(event) {
          if (!(event.target instanceof HTMLElement)) {
            return;
          }
          // ignore interactive elements
          if (event.target.closest(`[${blockBoardPanningAttr}]`)) {
            return;
          }

          begin({ startX: event.clientX });
        },
      },
    ]);

    return function cleanupAll() {
      cleanupStart();
      cleanupActive?.();
    };
  }, []);

  return (
    <div className={`flex h-full flex-col ${settings.isBoardMoreObvious ? 'px-32 py-20' : ''}`}>
      <div
        className={`flex h-full flex-col gap-[2px] overflow-x-auto p-[2px] [scrollbar-color:var(--color-sky-600)_var(--color-sky-800)] [scrollbar-width:thin] ${settings.isBoardMoreObvious ? 'rounded-sm border-2 border-dashed' : ''}`}
        ref={scrollableRef}
      >
        {data.columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
}
