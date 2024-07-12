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

type Person = {
    name: string;
    description: string;
    weight: string;
};

const data = [
    {
        name: 'sowrd',
        description: 'sharp sword',
        weight: '7',
        quantity: '1'
    },
    {
        name: 'shield',
        description: 'strong shield',
        weight: '5',
        quantity: '1'
    },
    {
        name: 'armor',
        description: 'heavy armor',
        weight: '10',
        quantity: '1'
    },
    {
        name: 'bow',
        description: 'long bow',
        weight: '5',
        quantity: '1'
    },
    {
        name: 'arrow',
        description: 'sharp arrow',
        weight: '1',
        quantity: '20'
    },
];


const CustomTable = () => {
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

    console.log(themeMode);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: themeMode,
                    background: {
                        paper: themeMode === 'dark' ? '#111' : '#ffffff',
                    },
                },
            }),
        [themeMode]
    );

    const columns = useMemo<MRT_ColumnDef<Person>[]>(
        //column definitions...
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
            },
            {
                accessorKey: 'description',
                header: 'Description',
            },
            {
                accessorKey: 'weight',
                header: 'Weight',
            },
            {
                accessorKey: 'quantity',
                header: 'Quantity',
            },
        ],
        [],
        //end
    );
    const [dataSlices, setDataSlices] = useState<Person[][]>([data.slice(0, 3), data.slice(3, 4), data.slice(4, 5)]);
    const [data1, setData1] = useState<Person[]>(() => data.slice(0, 3));
    const [data2, setData2] = useState<Person[]>(() => data.slice(3, 5));

    const [draggingRow, setDraggingRow] = useState<MRT_Row<Person> | null>(null);
    const [hoveredTable, setHoveredTable] = useState<string | null>(null);
    const [startHoveredTable, setStartHoveredTable] = useState<string | null>(null);

    const commonTableProps: Partial<MRT_TableOptions<Person>> & {
        columns: MRT_ColumnDef<Person>[];
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
        initialState: { density: 'compact' },
        muiTopToolbarProps: {
            sx: {
                backgroundColor: theme.palette.background.paper,
                borderBottom: '1px solid lightgray',
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

    const createTable = (index: number, singleItemTable: boolean, name: string) => {
        const table_n = useMaterialReactTable({
            ...commonTableProps,
            data: dataSlices[index],
            defaultColumn: {
                size: 100,
            },
            getRowId: (originalRow) => {
                for (let i = 0; i < dataSlices.length; i++) {
                    if (i !== index && dataSlices[i].includes(originalRow)) {
                        return `table-${i}-${originalRow.name}`;
                    }
                }
                return `table-${index}-${originalRow.name}`;
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
        return table_n;
    }

    const table1 = createTable(0, false, 'Body');
    const table2 = createTable(1, false, 'Backpack');
    const table3 = createTable(2, true, 'Chest');


    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ gap: '16px' }}>
                <MaterialReactTable table={table1} />
                <MaterialReactTable table={table2} />
                <MaterialReactTable table={table3} />
            </Box>
        </ThemeProvider>
    );
};

export default CustomTable;
