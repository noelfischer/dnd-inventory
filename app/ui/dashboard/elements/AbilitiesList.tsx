'use server'

import { Ability } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';

const AbilitiesList = async ({ character_id }: { character_id: string }) => {
    const data = await sql<Ability>`SELECT ability_name, description FROM Abilities WHERE character_id = ${character_id}`;
    const abilities = data.rows;
    const noAbilities = abilities.length < 1;

    return (
        <div className="abilities">
            <h2 className='text-2xl'>Abilities</h2>
            {noAbilities && <p>No abilities.</p>}
            {!noAbilities &&
                <ul>
                    {abilities.map(ability => (
                        <li key={ability.ability_id}>
                            {ability.ability_name}
                            <p>{ability.description}</p>
                        </li>
                    ))}
                </ul>
            }
        </div>
    );
};

export default AbilitiesList;
