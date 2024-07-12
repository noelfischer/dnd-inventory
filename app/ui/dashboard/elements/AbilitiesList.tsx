import { Ability } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';

const AbilitiesList = async ({ character_id }: { character_id: string }) => {
    const data = await sql<Ability>`SELECT ability_name, description FROM Abilities WHERE character_id = ${character_id}`;
    const abilities = data.rows;
    if (abilities.length === 0) {
        notFound();
    }

    return (
        <div className="abilities">
            <h2 className='text-2xl'>Abilities</h2>
            <ul>
                {abilities.map(ability => (
                    <li key={ability.ability_id}>
                        {ability.ability_name}
                        <p>{ability.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AbilitiesList;
