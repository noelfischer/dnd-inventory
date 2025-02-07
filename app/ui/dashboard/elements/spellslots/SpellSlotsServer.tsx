'use server'

import SpellSlotsClient from "./SpellSlotsClient";
import { getSpellSlots, SpellSlotWithoutCharacterID, updateRemainingCasts, updateTotalCasts } from "./helper";


const SpellSlotsServer = async ({ character_id }: { character_id: string }) => {
    const spellSlots = await getSpellSlots(character_id);

    async function updateRemainingCastsServer(character_id: string, spellSlots: SpellSlotWithoutCharacterID) {
        'use server'
        updateRemainingCasts(character_id, spellSlots);
    }
    async function updateTotalCastsServer(character_id: string, spellSlots: SpellSlotWithoutCharacterID) {
        'use server'
        updateTotalCasts(character_id, spellSlots);
    }

    return (
        <div>
            <SpellSlotsClient spell_slots={spellSlots} character_id={character_id} updateRemainingCasts={updateRemainingCastsServer} updateTotalCasts={updateTotalCastsServer} />
        </div>
    );
};

export default SpellSlotsServer;