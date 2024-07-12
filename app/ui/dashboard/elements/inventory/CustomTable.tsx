'use client'

import { useEffect, useMemo, useState } from 'react';
import {
    type MRT_TableOptions,
    type MRT_ColumnDef,
    type MRT_Row,
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Box, ThemeProvider, Typography, createTheme } from '@mui/material';
import { InventoryItem } from '@/app/lib/definitions';

const CustomTable = ({ items }: { items: InventoryItem[] }) => {
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
    useEffect(() => {
        window.addEventListener('storage', () => {
            setThemeMode(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
        })
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setThemeMode('dark');
        }
    }, []);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: themeMode,
                    background: {
                        paper: themeMode === 'dark' ? '#111' : '#ffffff',
                    },
                },
                components: {
                    MuiTypography: {
                        styleOverrides: {
                            //@ts-ignore
                            root: {
                                padding: "0 0 0 5px!important",
                                textAlign: "start!important",
                            },
                        },
                    },
                },
            }),
        [themeMode]
    );

    const columns = useMemo<MRT_ColumnDef<InventoryItem>[]>(
        //column definitions...
        () => [
            { accessorKey: 'item_name', header: 'Name', },
            { accessorKey: 'description', header: 'Description', },
            { accessorKey: 'ability', header: 'Ability', },
            { accessorKey: 'weight', header: 'Weight', },
            { accessorKey: 'quantity', header: 'Quantity', },
            { accessorKey: 'category', header: 'Category', },
            { accessorKey: 'magic', header: 'Magic', }
        ],
        [],
        //end
    );

    const splitData = (data: InventoryItem[]) => {
        const hand: InventoryItem[] = data.filter((d) => d.slot === 'hand');
        const head: InventoryItem[] = data.filter((d) => d.slot === 'head');
        const wear: InventoryItem[] = data.filter((d) => d.slot === 'wear');
        const ring: InventoryItem[] = data.filter((d) => d.slot === 'ring');
        const consumable: InventoryItem[] = data.filter((d) => d.slot === 'consumable');
        const body: InventoryItem[] = data.filter((d) => d.slot === 'body');
        const backpack: InventoryItem[] = data.filter((d) => d.slot === 'backpack');
        const chests: InventoryItem[][] = [];
        data.filter((d) => d.slot.match('chest')).forEach((d) => {
            const chestNumber = d.slot.split(' ')[1];
            if (chestNumber) {
                if (!chests[parseInt(chestNumber) - 1]) {
                    chests[parseInt(chestNumber) - 1] = [];
                }
                chests[parseInt(chestNumber) - 1].push(d);
            }
        });
        return [hand, head, wear, ring, consumable, body, backpack, ...chests];
    }

    const [dataSlices, setDataSlices] = useState<InventoryItem[][]>(splitData(items));

    const [draggingRow, setDraggingRow] = useState<MRT_Row<InventoryItem> | null>(null);
    const [hoveredTable, setHoveredTable] = useState<string | null>(null);
    const [startHoveredTable, setStartHoveredTable] = useState<string | null>(null);

    const commonTableProps: Partial<MRT_TableOptions<InventoryItem>> & {
        columns: MRT_ColumnDef<InventoryItem>[];
    } = {
        columns,
        enableRowDragging: true,
        enableFullScreenToggle: false,
        enablePagination: false,
        enableBottomToolbar: false, //hide the bottom toolbar as well if you want
        enableSorting: false,
        enableEditing: true,
        enableColumnActions: false,
        enableGlobalFilter: false,
        enableFilters: false,
        enableDensityToggle: false,
        enableHiding: false,
        enableTableHead: false,
        initialState: { density: 'compact' },
        muiTopToolbarProps: {
            sx: {
                backgroundColor: theme.palette.background.paper,
            },
        },
        muiTableHeadCellProps: {
            sx: {
                backgroundColor: theme.palette.background.paper,
            },
        },
        muiTableBodyCellProps: {
            sx: {
                backgroundColor: theme.palette.background.paper,
            },
        },
        muiTableProps: {
            sx: {
                backgroundColor: theme.palette.background.paper,
            },
        },
        onDraggingRowChange: setDraggingRow,
        state: { draggingRow },
    };

    const TableComponent = (index: number, singleItemTable: boolean, name: string) => {
        const table_n = useMaterialReactTable({
            ...commonTableProps,
            data: dataSlices[index],
            defaultColumn: {
                size: 100,
            },
            getRowId: (originalRow) => {
                for (let i = 0; i < dataSlices.length; i++) {
                    if (i !== index && dataSlices[i].includes(originalRow)) {
                        return `table-${i}-${originalRow.item_name}`;
                    }
                }
                return `table-${index}-${originalRow.item_name}`;
            },
            muiRowDragHandleProps: {
                onDragEnd: () => {
                    if (hoveredTable !== null && hoveredTable !== ('table-' + index)) {
                        dataSlices[index] = dataSlices[index].filter((d) => d !== draggingRow!.original);
                        dataSlices[parseInt(hoveredTable.split('-')[1])] = [
                            ...dataSlices[parseInt(hoveredTable.split('-')[1])], draggingRow!.original,
                        ];
                    }
                    setDataSlices(dataSlices);
                    setHoveredTable(null);
                },
            },
            muiTablePaperProps: {
                onDragEnter: () => setHoveredTable(('table-' + index)),
                sx: {
                    outline: hoveredTable === ('table-' + index) ? '2px dashed pink' : undefined,
                },
                onDragStart: () => setStartHoveredTable(('table-' + index)),
            },
            renderTopToolbarCustomActions: () => (
                <Typography component="span" variant="h5" sx={{ padding: 0 }}>
                    {name}
                </Typography>
            ),
        });
        return <MaterialReactTable key={index} table={table_n} />;
    }
    const table: any = [];
    table[0] = TableComponent(0, false, 'Hand');
    table[1] = TableComponent(1, false, 'Head');
    table[2] = TableComponent(2, true, 'Wear');
    table[3] = TableComponent(3, true, 'Ring');
    table[4] = TableComponent(4, true, 'Consumable');
    table[5] = TableComponent(5, true, 'Body');
    table[6] = TableComponent(6, true, 'Backpack');
    for (let i = 7; i < dataSlices.length; i++) {
        table[i] = TableComponent(i, true, `Chest ${i - 6}`);
    }



    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ gap: '16px' }}>
                {table.map((table_n: any, index: number) => (
                    <div key={index} className='border-8'>{table[index]}</div>
                ))}
            </Box>
        </ThemeProvider>
    );
};

export default CustomTable;
