import { Condition } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';

const ConditionsList = async ({ character_id }: { character_id: string }) => {
    const data = await sql<Condition>`SELECT condition_name, duration, impact FROM Conditions WHERE character_id = ${character_id}`;
    const conditions = data.rows;
    if (conditions.length === 0) {
        notFound();
    }

    return (
        <div className="conditions">
            <h2 className='text-2xl'>Conditions</h2>
            <ul>
                {conditions.map(condition => (
                    <li key={condition.condition_id}>
                        {condition.condition_name} (Duration: {condition.duration} rounds)
                        <p>{condition.impact}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConditionsList;
