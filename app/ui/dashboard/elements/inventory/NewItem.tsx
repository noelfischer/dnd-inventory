'use client'

import { FormItemCheckbox, FormItemInput, FormItemSelect } from '@/app/ui/campaigns/CustomForm'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'



const NewItem = ({ className, createItem }: { className?: string, createItem: (item: FormData) => void }) => {
    const [open, setOpen] = useState(false);

    async function handleSubmit(formData: FormData) {
        await createItem(formData)
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild>
                <Button className={className}>New Item</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <form action={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className='text-text'>New Item</DialogTitle>
                        <DialogDescription className='text-text'>
                            Create a new item to add to your inventory.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <FormItemInput name="item_name" label="Name" className='col-span-4 w-full' minLength={2} />
                            <FormItemInput name="description" label="Description" className='col-span-4 w-full' />
                            <FormItemSelect name="category" label="Category" defaultValue='M' classNameLabel='text-text' className='col-span-2 w-full' options={[{ key: 'W', value: 'Weapon' }, { key: 'A', value: 'Armor' }, { key: 'B', value: 'Wearable' }, { key: 'T', value: 'Tool' }, { key: 'C', value: 'Consumable' }, { key: 'M', value: 'Miscellaneous' }]} />
                            <FormItemSelect name="slot" label="Slot" defaultValue='eq' classNameLabel='text-text' className='col-span-2 w-full' options={[{ key: 'eq', value: 'Equipped' }, { key: 'bd', value: 'On Body' }, { key: 'bp', value: 'Backpack' }]} />
                            <FormItemInput name="weight" label="Weight" type="number" className='col-span-1 w-full' min={0} max={500} defaultValue="1" />
                            <FormItemInput name="quantity" label="Quantity" type="number" className='col-span-1 w-full' min={0} max={1000} defaultValue="1" />
                            <FormItemCheckbox name="magic" label="Magic" defaultChecked={false} className='col-span-2 w-full' />

                        </div>
                    </div>
                    <DialogFooter>
                        <Button type='submit'>Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    )
}

export default NewItem;