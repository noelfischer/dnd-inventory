import { InventoryItem } from "@prisma/client";
import { HandleRef, Item } from "./helper";
import { Board } from "./pragmatic-board/shared/board";
import { TColumn } from "./pragmatic-board/shared/data";
import { Dictionary } from "@/app/[lang]/dictionaries";


type DraggableTablesProps = {
  tables: Item[];
  setTables: React.Dispatch<React.SetStateAction<Item[]>>;
  updateIndex: (items: { item_id: string; i: number; slot: string }[]) => void;
  headerContent: () => React.ReactNode;
  renderRow: (row: InventoryItem, index: number) => (ref: HandleRef) => React.ReactNode;
  footerContent: (id: string) => React.ReactNode;
  dictionary: Dictionary;
};

const DraggableTables = ({
  tables,
  setTables,
  updateIndex,
  headerContent,
  renderRow,
  footerContent,
  dictionary
}: DraggableTablesProps) => {


  const columns: TColumn[] = tables.map((table) => {
    return {
      id: table.name,
      title: getTableName(table.name, dictionary),
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

  const initialBoard = {
    tables,
    setTables,
    updateIndex,
    columns
  };


  return <Board initial={initialBoard} />;
}

function getTableName(short: string, dictionary: Dictionary) {
  switch (short) {
    case "eq": return dictionary.dashboard.inventory.equipped;
    case "bd": return dictionary.dashboard.inventory.onBody;
    case "bp": return dictionary.dashboard.inventory.backpack;
    default: return dictionary.dashboard.inventory.backpack;
  }
}

export default DraggableTables;