'use client'

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { LoaderCircle, Plus } from "lucide-react";
import { FormItemSelect } from "../../campaigns/CustomForm";
import { useEffect, useState } from "react";
import { cn, keyValuePair } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel,
    SelectGroup,
} from "@/components/ui/select"
import { useDictionary } from "@/app/[lang]/DictionaryProvider";

// if a dashboard element is already present, it should not be displayed in the add element dropdown
export type AddableElement = {
    character: keyValuePair,
    addableElements: keyValuePair[]
}

export default function AddElement({ addableElements, addElementHandler, disabled = false }: { addableElements: AddableElement[], addElementHandler: (formData: FormData) => Promise<string>, disabled?: boolean }) {
    const dictionary = useDictionary();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedCharacter, setSelectedCharacter] = useState(addableElements[0]?.character.key);
    const elementSelect: keyValuePair[] = addableElements.find(addableElement => addableElement.character.key == selectedCharacter)?.addableElements || addableElements[0]?.addableElements || [];

    async function formAction(formData: FormData) {
        await setOpen(false)
        await setLoading(true)
        await addElementHandler(formData)
        setLoading(false);
    }

    useEffect(() => {
        setLoading(false);
        setOpen(false);
    }, [loading, addableElements])

    return (
        <div>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button className='min-w-[160px] flex justify-between bg-main-accent' disabled={disabled || loading}>
                        {loading && <LoaderCircle className='animate-spin ml-2' />}
                        {dictionary.dashboard.navigation.element.title}<Plus className="ml-2" /></Button>
                </SheetTrigger>
                <SheetContent>
                    <form action={formAction}>
                        <SheetHeader>
                            <SheetTitle>{dictionary.dashboard.navigation.element.title}</SheetTitle>
                            <SheetDescription>
                                {dictionary.dashboard.navigation.element.description}
                            </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                            <CustomFormItemSelect label="Character" name="character" options={addableElements.map((e: AddableElement) => e.character)}
                                defaultValue={addableElements[0]?.character.key} valueChange={(e) => { setSelectedCharacter(e) }} visible={addableElements.length > 1}
                            />
                            {elementSelect.length == 0 ? <p className="text-gray-500 px-2">{dictionary.dashboard.navigation.element.noMore}</p> :
                                <FormItemSelect label="Element Type" name="element" options={elementSelect} defaultValue={elementSelect[0].key} classNameSelectContent="max-h-[500px]" />
                            }
                        </div>
                        <SheetFooter>
                            <Button type="submit" disabled={elementSelect.length == 0}>{dictionary.dashboard.navigation.element.title}</Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}

const CustomFormItemSelect = ({ name, label, options, defaultValue = "", visible = true, valueChange }: {
    name: string, label: string, options: keyValuePair[], defaultValue?: string, visible?: boolean, valueChange?: (value: string) => void
}) => {
    return (
        <div className={(visible ? "mb-4" : "invisible max-h-0")}>
            <label htmlFor={name} className={cn(
                'mb-2 block text-sm font-medium',
            )}>
                {label}
            </label>
            <Select name={name} defaultValue={defaultValue} onValueChange={valueChange}>
                <SelectTrigger>
                    <SelectValue placeholder={label} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{label}</SelectLabel>
                        {options.map((option, index) => (
                            <SelectItem key={option.key} value={option.key} >
                                {option.value}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}