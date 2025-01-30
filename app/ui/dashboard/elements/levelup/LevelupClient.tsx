'use client'

import { FormItemInput } from "@/app/ui/campaigns/CustomForm";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from "react";
import { SpellSlotWithoutCharacterID } from "../spellslots/helper";
import { LevelUpCharacter } from "./LevelupServer";
import { LoaderCircle } from "lucide-react";

const LevelupClient = ({ character, spellSlots, levelup }: { character: LevelUpCharacter, spellSlots: SpellSlotWithoutCharacterID[], levelup: (character: LevelUpCharacter, spell_slots: SpellSlotWithoutCharacterID[]) => Promise<void> }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    function parseAndValidate(formDataEntryValue: FormDataEntryValue | null): number | null {
        if (formDataEntryValue === null || formDataEntryValue === undefined || formDataEntryValue === '') {
            return null;
        }
        const value = parseInt(formDataEntryValue as string);
        if (isNaN(value)) {
            return null;
        }
        return value;
    }

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        character.max_hit_points = parseAndValidate(formData.get('max_hit_points')) ?? character.max_hit_points;
        character.armor_class = parseAndValidate(formData.get('armor_class')) ?? character.armor_class;
        character.strength = parseAndValidate(formData.get('strength')) ?? character.strength;
        character.dexterity = parseAndValidate(formData.get('dexterity')) ?? character.dexterity;
        character.constitution = parseAndValidate(formData.get('constitution')) ?? character.constitution;
        character.intelligence = parseAndValidate(formData.get('intelligence')) ?? character.intelligence;
        character.wisdom = parseAndValidate(formData.get('wisdom')) ?? character.wisdom;
        character.charisma = parseAndValidate(formData.get('charisma')) ?? character.charisma;

        spellSlots[0].total_casts = parseAndValidate(formData.get('spell_slots_0')) ?? spellSlots[0].total_casts;
        spellSlots[1].total_casts = parseAndValidate(formData.get('spell_slots_1')) ?? spellSlots[1].total_casts;
        spellSlots[2].total_casts = parseAndValidate(formData.get('spell_slots_2')) ?? spellSlots[2].total_casts;
        spellSlots[3].total_casts = parseAndValidate(formData.get('spell_slots_3')) ?? spellSlots[3].total_casts;
        spellSlots[4].total_casts = parseAndValidate(formData.get('spell_slots_4')) ?? spellSlots[4].total_casts;
        spellSlots[5].total_casts = parseAndValidate(formData.get('spell_slots_5')) ?? spellSlots[5].total_casts;
        spellSlots[6].total_casts = parseAndValidate(formData.get('spell_slots_6')) ?? spellSlots[6].total_casts;
        spellSlots[7].total_casts = parseAndValidate(formData.get('spell_slots_7')) ?? spellSlots[7].total_casts;
        spellSlots[8].total_casts = parseAndValidate(formData.get('spell_slots_8')) ?? spellSlots[8].total_casts;
        spellSlots[9].total_casts = parseAndValidate(formData.get('spell_slots_9')) ?? spellSlots[9].total_casts;
        spellSlots[10].total_casts = parseAndValidate(formData.get('spell_slots_10')) ?? spellSlots[10].total_casts;
        await levelup(character, spellSlots);
        setOpen(false);
        setLoading(false);
        const event = new CustomEvent('levelup');
        window.dispatchEvent(event);
    }

    return (
        <div className="h-full w-full">
            <Dialog open={open} onOpenChange={setOpen}>

                <DialogTrigger asChild>
                    <button className="group h-full w-full relative overflow-hidden bg-secondary text-black text-2xl transition-all duration-300
            before:absolute before:left-0 before:bottom-0 before:w-full before:h-0 hover:before:h-full 
            hover:text-white hover:font-bold hover:before:skew-y-0 hover:font-bold hover:scale-105 
            before:bg-green-500 before:transition-all before:duration-500 before:origin-bottom-left before:skew-y-6">
                        <span className="relative z-10 h-full w-full group-hover:[text-shadow:_0_2px_0_rgb(0_0_0_/_40%)] delay-100 transition-all duration-300">Level Up</span>
                    </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[625px]">
                    <form action={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle className='text-text text-4xl'>Level Up to Level {character.level + 1}?</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-2">
                            <h2 className="text-text text-md mt-5">Change stats</h2>
                            <div className="grid grid-cols-4 items-center gap-x-4">
                                <FormItemInput name="max_hit_points" label="max hit points" type="number" max={9999} defaultValue={character.max_hit_points.toString()} />
                                <FormItemInput name="armor_class" label="armor class" type="number" max={50} defaultValue={character.armor_class.toString()} />
                                <FormItemInput name="strength" label="strength" type="number" defaultValue={character.strength.toString()} />
                                <FormItemInput name="dexterity" label="dexterity" type="number" defaultValue={character.dexterity.toString()} />
                                <FormItemInput name="constitution" label="constitution" type="number" defaultValue={character.constitution.toString()} />
                                <FormItemInput name="intelligence" label="intelligence" type="number" defaultValue={character.intelligence.toString()} />
                                <FormItemInput name="wisdom" label="wisdom" type="number" defaultValue={character.wisdom.toString()} />
                                <FormItemInput name="charisma" label="charisma" type="number" defaultValue={character.charisma.toString()} />
                            </div>
                            <h2 className="text-text text-md mt-6">Spell Capacity</h2>
                            <div className="grid grid-cols-6 items-center gap-x-2">
                                <FormItemInput name="spell_slots_0" label="Ability" type="number" defaultValue={spellSlots[0].total_casts.toString()} />
                                <FormItemInput name="spell_slots_1" label="1. Level" type="number" defaultValue={spellSlots[1].total_casts.toString()} />
                                <FormItemInput name="spell_slots_2" label="2. Level" type="number" defaultValue={spellSlots[2].total_casts.toString()} />
                                <FormItemInput name="spell_slots_3" label="3. Level" type="number" defaultValue={spellSlots[3].total_casts.toString()} />
                                <FormItemInput name="spell_slots_4" label="4. Level" type="number" defaultValue={spellSlots[4].total_casts.toString()} />
                                <FormItemInput name="spell_slots_5" label="5. Level" type="number" defaultValue={spellSlots[5].total_casts.toString()} />
                                <FormItemInput name="spell_slots_6" label="6. Level" type="number" defaultValue={spellSlots[6].total_casts.toString()} />
                                <FormItemInput name="spell_slots_7" label="7. Level" type="number" defaultValue={spellSlots[7].total_casts.toString()} />
                                <FormItemInput name="spell_slots_8" label="8. Level" type="number" defaultValue={spellSlots[8].total_casts.toString()} />
                                <FormItemInput name="spell_slots_9" label="9. Level" type="number" defaultValue={spellSlots[9].total_casts.toString()} />
                                <FormItemInput name="spell_slots_10" label="10. Level" type="number" defaultValue={spellSlots[10].total_casts.toString()} />

                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type='submit' disabled={loading}>Level Up {loading && <LoaderCircle className='animate-spin ml-2' />}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default LevelupClient;


