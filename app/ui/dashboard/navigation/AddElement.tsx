'use client'

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { LoaderCircle, Plus } from "lucide-react";
import { FormItemSelect, keyValuePair } from "../../campaigns/CustomForm";
import { useState } from "react";

export default function AddElement({ characters, addElementHandler, disabled = false }: { characters: keyValuePair[], addElementHandler: (formData: FormData) => Promise<string>, disabled?: boolean }) {
    const [loading, setLoading] = useState(false);

    function formAction(formData: FormData) {
        addElementHandler(formData).then(() =>
            // artificially increase time to match addition of element
            setTimeout(() => { setLoading(false); }, 2100)
        );
    }

    const elementOptions = [
        { key: "name", value: "Name" },
        { key: "health", value: "Health" },
        { key: "inventory", value: "Inventory" },
        { key: "currency", value: "Coinage" },
        { key: "conditions", value: "Conditions" },
        { key: "spells", value: "Spells" },
        { key: "weight", value: "Weight" },
        { key: "notes", value: "Notes" },
        { key: "abilities", value: "Abilities" },
        { key: "spellslots", value: "Spell Slots" },
        { key: "inspiration", value: "Inspiration" },
    ].sort((a, b) => a.value.localeCompare(b.value));

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className='min-w-[160px] flex justify-between bg-mainAccent' disabled={disabled || loading}>
                    {loading && <LoaderCircle className='animate-spin ml-2' />}
                    Add Element<Plus /></Button>
            </SheetTrigger>
            <SheetContent>
                <form action={formAction}>
                    <SheetHeader>
                        <SheetTitle>Add Element</SheetTitle>
                        <SheetDescription>
                            Select the type of element you want to add to the dashboard.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <FormItemSelect label="Character" name="character" options={characters} defaultValue={characters[0].key} visible={characters.length > 1} />
                        <FormItemSelect label="Element Type" name="element" options={elementOptions} defaultValue='name' classNameSelectContent="max-h-[500px]" />
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit" onClick={() => setLoading(true)}>Add Element</Button>
                        </SheetClose>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}