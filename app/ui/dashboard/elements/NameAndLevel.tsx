import { Character } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';

const NameAndLevel = async ({ character_id }: { character_id: string }) => {
    const data = await sql<Character>`SELECT name, cclass, level FROM Characters WHERE character_id = ${character_id}`;
    const character = data.rows[0];
    if (!character) {
        notFound();
    }

    return (
        <div>
            <h1 className='text-3xl'>{character.name}, {character.cclass}, Level {character.level}</h1>
        </div>
    );
};

export default NameAndLevel;