'use server'

import { GeneralSpell } from "@/app/lib/definitions";
import SpellsClient from "./SpellsClient";
import { sql } from "@vercel/postgres";
import { nanoid } from "nanoid";


const SpellsServer = async ({ character_id }: { character_id: string }) => {
    const data = await sql<GeneralSpell>`SELECT us.user_spell_id, gs.spell_name_de, spell_name_en, spell_level FROM UserSpells us JOIN GeneralSpells gs ON us.spell_id = gs.spell_id WHERE us.character_id = ${character_id}`;
    const userspells: GeneralSpell[] = data.rows;

    const character_info = await sql`SELECT level, cclass FROM Characters WHERE character_id = ${character_id}`;
    const spell_max_level = Math.floor((character_info.rows[0].level + 1) / 2);

    const ldata = await sql<GeneralSpell>`SELECT spell_id, spell_name_de, spell_name_en, spell_level FROM GeneralSpells WHERE spell_level <= ${spell_max_level} AND classes LIKE ${"%" + character_info.rows[0].cclass + "%"}`;
    let all_learnable_spells = ldata.rows;
    all_learnable_spells = all_learnable_spells.filter(spell => !userspells.some(userspell => userspell.spell_name_de === spell.spell_name_de || userspell.spell_name_en === spell.spell_name_en));


    async function learnSpell(spell_id: string) {
        'use server'
        const user_spell_id = nanoid(10);
        await sql`INSERT INTO UserSpells (user_spell_id, character_id, spell_id) VALUES (${user_spell_id}, ${character_id}, ${spell_id})`;
    }

    async function forgetSpell(name: string) {
        'use server'
        // first get the spell_id
        const spell_id = await sql`SELECT spell_id FROM GeneralSpells WHERE spell_name_de = ${name} OR spell_name_en = ${name}`;
        if (spell_id.rows.length < 1) {
            return;
        }
        await sql`DELETE FROM UserSpells WHERE character_id = ${character_id} AND spell_id = ${spell_id.rows[0].spell_id}`;
    }


    return (
        <div className="w-full h-full">
            <SpellsClient userspells={userspells} learnableSpells={all_learnable_spells} learnSpell={learnSpell} forgetSpell={forgetSpell} />
        </div>
    );
};

export default SpellsServer;
