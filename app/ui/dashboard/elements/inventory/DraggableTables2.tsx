import { Board } from "@/components/pragmatic-board/shared/board";
import { TColumn } from "@/components/pragmatic-board/shared/data";
import { InventoryItem } from "@prisma/client";
import { HandleRef, Item } from "./helper";


type DraggableTablesProps = {
  tables: Item[];
  setTables: React.Dispatch<React.SetStateAction<Item[]>>;
  updateIndex: (items: { item_id: string; i: number; slot: string }[]) => void;
  headerContent: () => React.ReactNode;
  renderRow: (row: InventoryItem, index: number) => (ref: HandleRef) => React.ReactNode;
  footerContent: (id: string) => React.ReactNode;
};

const DraggableTables = ({
  tables,
  setTables,
  updateIndex,
  headerContent,
  renderRow,
  footerContent
}: DraggableTablesProps) => {


  const columns: TColumn[] = tables.map((table) => {
    return {
      id: table.name,
      title: getTableName(table.name),
      header: headerContent,
      footer: footerContent,
      cards: table.rows.map((row, index) => {
        return {
          id: row.item_id,
          gridRow: renderRow(row, index)
        };
      })
    };
  });

  const initialBoard = { columns };


  return <Board initial={initialBoard} />;
}

function getTableName(short: string) {
  return short === "eq" ? "Equipped" : short === "bd" ? "On Body" : "Backpack"
}

export default DraggableTables;