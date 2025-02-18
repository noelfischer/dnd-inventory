import { useDictionary } from '@/app/[lang]/DictionaryProvider'
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
    const dictionary = useDictionary();
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
                        <DialogTitle className='text-text'>{dictionary.dashboard.inventory.edit}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <FormItemInput name="item_name" label={dictionary.general.name} className='col-span-4 w-full' defaultValue={item.item_name} placeholder={item.item_name || dictionary.general.description} minLength={2} />
                            <FormItemInput name="description" label={dictionary.general.description} className='col-span-4 w-full' defaultValue={item.description} placeholder={item.description || dictionary.general.description} />
                            <FormItemSelect name="category" label={dictionary.dashboard.inventory.new.category.title} defaultValue={item.category} classNameLabel='text-text' className='col-span-2 w-full' options=
                                {[
                                    { key: 'W', value: dictionary.dashboard.inventory.new.category.weapon },
                                    { key: 'A', value: dictionary.dashboard.inventory.new.category.armor },
                                    { key: 'B', value: dictionary.dashboard.inventory.new.category.wearable },
                                    { key: 'T', value: dictionary.dashboard.inventory.new.category.tool },
                                    { key: 'C', value: dictionary.dashboard.inventory.new.category.consumable },
                                    { key: 'M', value: dictionary.dashboard.inventory.new.category.miscellaneous }]
                                } />
                            <FormItemSelect name={dictionary.dashboard.inventory.new.slot} label="Slot" defaultValue={item.slot} classNameLabel='text-text' className='col-span-2 w-full' options=
                                {[
                                    { key: 'eq', value: dictionary.dashboard.inventory.equipped },
                                    { key: 'bd', value: dictionary.dashboard.inventory.onBody },
                                    { key: 'bp', value: dictionary.dashboard.inventory.backpack }
                                ]} />
                            <div className="grid grid-cols-5 col-span-4 gap-4">
                                <FormItemInput name={dictionary.dashboard.inventory.weight} label="Weight" type="number" className='col-span-2 w-full' min={0} max={500} defaultValue={item.weight.toString()} placeholder={item.weight.toString()} />
                                <FormItemInput name={dictionary.dashboard.inventory.quantity} label="Quantity" type="number" className='col-span-2 w-full' min={0} max={1000} defaultValue={item.quantity.toString()} placeholder={item.quantity.toString()} autofocus />
                                <FormItemCheckbox name={dictionary.dashboard.inventory.new.magic} label="Magic" defaultChecked={item.magic} className='col-span-1 w-full' />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className='sm:justify-between'>
                        <Button type='button' className='mt-4 sm:mt-0' onPointerDown={() => setPointHasDown(true)} onClick={handleDelete}>{dictionary.general.delete}</Button>
                        <Button type='submit' className='bg-main-accent'>{dictionary.general.update}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    )
}

export default EditItem;