'use client'

import { SpellSlot } from "@/app/lib/definitions";
import OnLeaveInput from "../helper/OnLeaveInput";

interface Props {
    spellSlots: SpellSlot[];
    character_id: string;
    updateRemainingCasts: (character_id: string, spellSlots: SpellSlot) => Promise<void>;
    updateLevelDescription: (character_id: string, spellSlots: SpellSlot) => Promise<void>;
}

const SpellSlotsClient = ({ spellSlots, character_id, updateRemainingCasts, updateLevelDescription }: Props) => {

    function updateLevelDescriptionClient(spellSlotID: string, levelDescription: string) {
        if (levelDescription.length > 100 || levelDescription.length < 1) {
            return;
        }
        const existingSlot = spellSlots.find(slot => slot.spell_slot_id === spellSlotID);
        if (!existingSlot) {
            return;
        }
        existingSlot.level_description = levelDescription;
        updateLevelDescription(character_id, existingSlot);
    }

    function updateRemainingCastsClient(spellSlotID: string, castsRemaining: number) {
        if (!(castsRemaining > 0 && castsRemaining < 999)) {
            return;
        }
        const existingSlot = spellSlots.find(slot => slot.spell_slot_id === spellSlotID);
        if (!existingSlot) {
            return;
        }
        existingSlot.casts_remaining = castsRemaining;
        updateRemainingCasts(character_id, existingSlot);
    }

    return (
        <div>
            <ul className="flex flex-row gap-2 flex-wrap">
                {spellSlots.sort((a, b) => a.spell_level - b.spell_level).map((spellslot: SpellSlot, index: number) => {
                    return (
                        <li key={index} className="w-max border-2 border-black rounded px-1.5 py-1.5 grow bg-main">
                            <div className="text-lg text-text text-center border-b-2 border-black pb-1.5">
                                <OnLeaveInput initialValue={spellslot.level_description} placeholder={spellslot.level_description}
                                    className="text-text ml-[3px] mt-0 text-center border-black placeholder:text-black/[.3] placeholder:font-medium placeholder:text-lg placeholder:text-center"
                                    onLeave={(value) => { updateLevelDescriptionClient(spellslot.spell_slot_id, value) }} />
                            </div>
                            <div className="text-2xl text-text text-center">
                                <OnLeaveInput initialValue={spellslot.casts_remaining.toString()} placeholder="Remaining"
                                    className="text-text border-black placeholder:text-black/[.3] placeholder:font-medium placeholder:text-xl placeholder:text-center"
                                    onLeave={(value) => { updateRemainingCastsClient(spellslot.spell_slot_id, parseInt(value)) }} />

                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default SpellSlotsClient;