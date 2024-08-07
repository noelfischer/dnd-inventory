import { UserSpell } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';

const SpellList = async ({ character_id }: { character_id: string }) => {
    const data = await sql<UserSpell>`SELECT gs.spell_name, us.prepared, us.slots_total, us.slots_used 
                                     FROM UserSpells us 
                                     JOIN GeneralSpells gs ON us.spell_id = gs.spell_id 
                                     WHERE us.character_id = ${character_id}`;
    const spells = data.rows;
    const noSpells = spells.length < 1;

    return (
        <div className="spells">
            <h2 className='text-2xl'>Spells</h2>
            {noSpells && <p>No spells.</p>}
            {!noSpells &&
                <ul>
                    {spells.map(spell => (
                        <li key={spell.user_spell_id}>
                            {spell.spell_name} {spell.prepared ? '(Prepared)' : ''}
                            <p>Slots: {spell.slots_used}/{spell.slots_total}</p>
                        </li>
                    ))}
                </ul>
            }
        </div>
    );
};

export default SpellList;
