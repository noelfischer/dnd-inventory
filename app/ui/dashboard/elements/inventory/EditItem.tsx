import { FormItemCheckbox, FormItemInput, FormItemSelect } from '@/app/ui/campaigns/CustomForm'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { InventoryItem } from '@prisma/client'
import { Pencil } from 'lucide-react'
import { useState } from 'react'

type Props = {
    item: InventoryItem;
    updateItem: (item: InventoryItem, formData: FormData) => void;
    deleteItem: (item_id: string) => void;
    className?: string;
}

const EditItem = ({ item, updateItem, deleteItem, className }: Props) => {
    const [open, setOpen] = useState(false);

    // This is a workaround to prevent the user from accidentally deleting an item
    // More info https://github.com/shadcn-ui/ui/issues/1220#issuecomment-1731562088
    const [pointHasDown, setPointHasDown] = useState(false);

    async function handleSubmit(formData: FormData) {
        updateItem(item, formData);
        setOpen(false);
    }

    async function handleDelete() {
        console.log('has down', pointHasDown);
        if (pointHasDown) {
            deleteItem(item.item_id);
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild>
                <Pencil className='cursor-pointer rounded-lg h-[28px] w-[28px] -my-0.5 mr-2  p-1 hover:bg-zinc-500/20' />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <form action={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className='text-text'>Edit Item</DialogTitle>
                        <DialogDescription className='text-text'>
                            Create a new item to add to your inventory.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <FormItemInput name="item_name" label="Name" className='col-span-4 w-full' defaultValue={item.item_name} minLength={2} />
                            <FormItemInput name="description" label="Description" className='col-span-4 w-full' defaultValue={item.description} />
                            <FormItemSelect name="category" label="Category" defaultValue={item.category} classNameLabel='text-text' className='col-span-2 w-full' options={[{ key: 'W', value: 'Weapon' }, { key: 'A', value: 'Armor' }, { key: 'B', value: 'Wearable' }, { key: 'T', value: 'Tool' }, { key: 'C', value: 'Consumable' }, { key: 'M', value: 'Miscellaneous' }]} />
                            <FormItemSelect name="slot" label="Slot" defaultValue={item.slot} classNameLabel='text-text' className='col-span-2 w-full' options={[{ key: 'eq', value: 'Equipped' }, { key: 'bd', value: 'On Body' }, { key: 'bp', value: 'Backpack' }]} />
                            <FormItemInput name="weight" label="Weight" type="number" className='col-span-1 w-full' min={0} max={500} defaultValue={item.weight.toString()} />
                            <FormItemInput name="quantity" label="Quantity" type="number" className='col-span-1 w-full' min={0} max={1000} defaultValue={item.quantity.toString()} autofocus />
                            <FormItemCheckbox name="magic" label="Magic" defaultChecked={item.magic} className='col-span-2 w-full' />
                        </div>
                    </div>
                    <DialogFooter className='sm:justify-between'>
                        <Button type='button' className='mt-4 sm:mt-0' onPointerDown={() => setPointHasDown(true)} onClick={handleDelete}>Delete</Button>
                        <Button type='submit' className='bg-main-accent'>Update</Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    )
}

export default EditItem;