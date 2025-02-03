'use client'

import OnLeaveInput from "../helper/OnLeaveInput";
import { useEffect, useState } from "react";
import { SpellSlotWithoutCharacterID } from "./helper";

interface Props {
    spell_slots: SpellSlotWithoutCharacterID[];
    character_id: string;
    updateRemainingCasts: (character_id: string, spell_slots: SpellSlotWithoutCharacterID) => Promise<void>;
    updateTotalCasts: (character_id: string, spell_slots: SpellSlotWithoutCharacterID) => Promise<void>;
}

const SpellSlotsClient = ({ spell_slots, character_id, updateRemainingCasts, updateTotalCasts }: Props) => {

    const [slots, setSlots] = useState<SpellSlotWithoutCharacterID[]>(spell_slots);

    function resetSlots() {
        spell_slots.forEach(slot => {
            slot.casts_remaining = slot.total_casts;
        });
        setSlots([...spell_slots]);
    }

    function levelup(e: any) {
        setSlots(e.detail.spellSlots);
    }

    useEffect(() => {
        setSlots(spell_slots);
        window.addEventListener('longRest', resetSlots);
        window.addEventListener('levelup', levelup);
        return () => {
            window.removeEventListener('longRest', resetSlots);
            window.removeEventListener('levelup', levelup);
        };
    }, [spell_slots]);

    function updateLevelDescriptionClient(spellSlotID: string, totalCasts: number) {
        if (!(totalCasts >= 0 && totalCasts < 999)) {
            totalCasts = 0;
        }
        const existingSlot = slots.find(slot => slot.spell_slot_id === spellSlotID);
        if (!existingSlot) {
            return;
        }
        existingSlot.total_casts = totalCasts;
        updateTotalCasts(character_id, existingSlot);
        setSlots([...slots]);
    }

    function updateRemainingCastsClient(spellSlotID: string, castsRemaining: number) {
        if (!(castsRemaining >= 0 && castsRemaining < 999)) {
            castsRemaining = 0;
        }
        const existingSlot = slots.find(slot => slot.spell_slot_id === spellSlotID);
        if (!existingSlot) {
            return;
        }
        existingSlot.casts_remaining = castsRemaining;
        updateRemainingCasts(character_id, existingSlot);
        setSlots([...slots]);
    }

    return (
        <div>
            <ul className="flex flex-row gap-2 flex-wrap">
                {slots.sort((a, b) => a.spell_level - b.spell_level).map((spellslot: SpellSlotWithoutCharacterID, index: number) => {
                    return (
                        <li key={index} className={"w-max border-2 border-black rounded-sm px-1.5 py-1.5 grow" + ((spellslot.casts_remaining / spellslot.total_casts) > 0 ? " bg-main-accent" : " bg-main/20")}>
                            <div className="text-lg text-text text-center border-b-2 border-black pb-1.5 z-10">
                                {(spellslot.spell_level === 0 ? "Ability" : createRomanNumeralSpan(spellslot.spell_level))} {" ("}
                                <OnLeaveInput initialValue={spellslot.total_casts.toString()} placeholder="Total"
                                    className="dark:text-text dark:border-black ml-[3px] mt-0 text-center placeholder:text-black/[.3] placeholder:font-medium placeholder:text-lg placeholder:text-center"
                                    onLeave={(value) => { updateLevelDescriptionClient(spellslot.spell_slot_id, parseInt(value)) }} />
                                {")"}
                            </div>
                            <div className="text-2xl text-text text-center">
                                <OnLeaveInput initialValue={spellslot.casts_remaining.toString()} placeholder="Remaining"
                                    className="dark:text-text dark:border-black placeholder:text-black/[.3] placeholder:font-medium placeholder:text-xl placeholder:text-center"
                                    onLeave={(value) => { updateRemainingCastsClient(spellslot.spell_slot_id, parseInt(value)) }} />

                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

function createRomanNumeralSpan(number: number) {
    // Helper function to convert an integer to a Roman numeral
    function intToRoman(num: number): string {
        const romanNumerals: [string, number][] = [
            ['X', 10],
            ['IX', 9],
            ['V', 5],
            ['IV', 4],
            ['I', 1]
        ];

        let result = '';
        for (const [roman, value] of romanNumerals) {
            while (num >= value) {
                result += roman;
                num -= value;
            }
        }
        return result;
    }
    return <span className="font-semibold underline underline-offset-2 decoration-2" style={{ textDecorationSkipInk: "none" }}>{intToRoman(number)}</span>;
}

export default SpellSlotsClient;