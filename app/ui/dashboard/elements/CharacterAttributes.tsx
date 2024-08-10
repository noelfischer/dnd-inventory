'use server'

import { Character } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';

const CharacterAttributes = async ({ character_id }: { character_id: string }) => {
    const data = await sql<Character>`SELECT strength, dexterity, constitution, intelligence, wisdom, charisma FROM Characters WHERE character_id = ${character_id}`;
    const character = data.rows[0];
    if (!character) {
        notFound();
    }

    return (
        <div className="attributes">
            <h2 className='text-2xl'>Attributes</h2>
            <ul>
                <li>Strength: {character.strength}</li>
                <li>Dexterity: {character.dexterity}</li>
                <li>Constitution: {character.constitution}</li>
                <li>Intelligence: {character.intelligence}</li>
                <li>Wisdom: {character.wisdom}</li>
                <li>Charisma: {character.charisma}</li>
            </ul>
        </div>
    );
};

export default CharacterAttributes;
