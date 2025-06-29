'use client'

import { useDictionary } from '@/app/[lang]/DictionaryProvider'
import { FormItemCheckbox, FormItemInput, FormItemSelect, FormItemTextArea } from '@/app/ui/campaigns/CustomForm'
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
import { useState } from 'react'



const NewItem = ({ className, createItem }: { className?: string, createItem: (item: FormData) => void }) => {
    const dictionary = useDictionary();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        await createItem(formData)
        setOpen(false);
        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger asChild>
                <Button className={className}>{dictionary.dashboard.inventory.new.title}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <form action={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className='text-text'>{dictionary.dashboard.inventory.new.title}</DialogTitle>
                        <DialogDescription className='text-text'>
                            {dictionary.dashboard.inventory.new.description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <FormItemInput name="item_name" label={dictionary.general.name} placeholder={dictionary.general.name} className='col-span-4 w-full' minLength={2} />
                            <FormItemTextArea name="description" label={dictionary.general.description} placeholder={dictionary.general.description} className='col-span-4 w-full' maxLength={199} />
                            <FormItemSelect name="category" label={dictionary.dashboard.inventory.new.category.title} defaultValue='M' classNameLabel='text-text' className='col-span-2 w-full' options=
                                {[
                                    { key: 'W', value: dictionary.dashboard.inventory.new.category.weapon },
                                    { key: 'A', value: dictionary.dashboard.inventory.new.category.armor },
                                    { key: 'B', value: dictionary.dashboard.inventory.new.category.wearable },
                                    { key: 'T', value: dictionary.dashboard.inventory.new.category.tool },
                                    { key: 'C', value: dictionary.dashboard.inventory.new.category.consumable },
                                    { key: 'M', value: dictionary.dashboard.inventory.new.category.miscellaneous }]
                                } />
                            <FormItemSelect name="slot" label={dictionary.dashboard.inventory.new.slot} defaultValue='eq' classNameLabel='text-text' className='col-span-2 w-full' options=
                                {[
                                    { key: 'eq', value: dictionary.dashboard.inventory.equipped },
                                    { key: 'bd', value: dictionary.dashboard.inventory.onBody },
                                    { key: 'bp', value: dictionary.dashboard.inventory.backpack }
                                ]} />
                            <div className="grid grid-cols-5 col-span-4 gap-4">
                                <FormItemInput name="weight" label={dictionary.dashboard.inventory.weight} type="number" className='col-span-2 w-full' min={0} max={500} defaultValue="1" />
                                <FormItemInput name="quantity" label={dictionary.dashboard.inventory.quantity} type="number" className='col-span-2 w-full' min={0} max={1000} defaultValue="1" />
                                <FormItemCheckbox name="magic" label={dictionary.dashboard.inventory.new.magic} defaultChecked={false} className='col-span-1 w-full' />
                            </div>

                        </div>
                    </div>
                    <DialogFooter>
                        <Button type='submit' disabled={loading}>{dictionary.general.create}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    )
}

export default NewItem;