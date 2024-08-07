import { InventoryItem } from '@/app/lib/definitions';
import Button from '@/components/Button';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { sql } from '@vercel/postgres';
import { ArrowDown, ArrowDownWideNarrow, ArrowUp, ArrowUpNarrowWide, Ham, PencilRuler, Pickaxe, Shield, Sword } from 'lucide-react';

const InventoryList = async ({ character_id }: { character_id: string }) => {
    const data = await sql<InventoryItem>`SELECT item_id, character_id, i, slot, item_name, description, ability, weight, category, magic, quantity FROM Inventory WHERE character_id = ${character_id}`;
    const items: InventoryItem[] = data.rows;

    return (
        <div className="inventory -z-50">
            <h3 className='text-text text-lg bg-main border-y-2 px-4 border-black font-medium'>Equiped</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Ability</TableHead>
                        <TableHead>Magic</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.filter(i => i.slot == "eq").map((item) => (
                        <TableRow key={item.item_id}>
                            <TableCell className="font-base flex gap-2">{selectIcon(item.category)} {item.item_name}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.ability}</TableCell>
                            <TableCell>{item.magic}</TableCell>
                            <TableCell>{item.weight} kg</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right flex flex-row-reverse cursor-pointer gap-2">
                                <Button className="w-auto p-1 hover:text-black/30"><ArrowDownWideNarrow className='transition-all hover:translate-y-0.5 hover:text-black' /><div className='rounded h-6 w-0.5 bg-black' /><ArrowUpNarrowWide className='text-black/30' /></Button>
                                <Button className="w-auto p-1 hover:text-black/30"><ArrowDown className='transition-all hover:translate-y-0.5 hover:text-black' /><div className='rounded h-6 w-0.5 bg-black' /><ArrowUp className='transition-all hover:-translate-y-0.5 hover:text-black' /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <h3 className='text-text text-lg bg-main border-y-2 px-4 border-black font-medium'>On Body</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Ability</TableHead>
                        <TableHead>Magic</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.filter(i => i.slot == "bd").map((item) => (
                        <TableRow key={item.item_id}>
                            <TableCell className="font-base flex gap-2">{selectIcon(item.category)} {item.item_name}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.ability}</TableCell>
                            <TableCell>{item.magic}</TableCell>
                            <TableCell>{item.weight} kg</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right flex flex-row-reverse cursor-pointer gap-2">
                                <Button className="w-auto p-1 hover:text-black/30"><ArrowDownWideNarrow className='transition-all hover:translate-y-0.5 hover:text-black' /><div className='rounded h-6 w-0.5 bg-black' /><ArrowUpNarrowWide className='transition-all hover:-translate-y-0.5 hover:text-black' /></Button>
                                <Button className="w-auto p-1 hover:text-black/30"><ArrowDown className='transition-all hover:translate-y-0.5 hover:text-black' /><div className='rounded h-6 w-0.5 bg-black' /><ArrowUp className='transition-all hover:-translate-y-0.5 hover:text-black' /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <h3 className='text-text text-lg bg-main border-y-2 px-4 border-black font-medium'>Backpack</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Ability</TableHead>
                        <TableHead>Magic</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.filter(i => i.slot == "bp").map((item) => (
                        <TableRow key={item.item_id}>
                            <TableCell className="font-base flex gap-2">{selectIcon(item.category)} {item.item_name}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.ability}</TableCell>
                            <TableCell>{item.magic}</TableCell>
                            <TableCell>{item.weight} kg</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right flex flex-row-reverse cursor-pointer gap-2">
                                <Button className="w-auto p-1 hover:text-black/30"><ArrowDownWideNarrow className='text-black/30' /><div className='rounded h-6 w-0.5 bg-black' /><ArrowUpNarrowWide className='transition-all hover:-translate-y-0.5 hover:text-black' /></Button>
                                <Button className="w-auto p-1 hover:text-black/30"><ArrowDown className='transition-all hover:translate-y-0.5 hover:text-black' /><div className='rounded h-6 w-0.5 bg-black' /><ArrowUp className='transition-all hover:-translate-y-0.5 hover:text-black' /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={6}>Total Weight</TableCell>
                        <TableCell className="text-right">87%</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
};


function selectIcon(category: string) {
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

export default InventoryList;
