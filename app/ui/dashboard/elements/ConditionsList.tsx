'use server'

import { Condition } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';

const ConditionsList = async ({ character_id }: { character_id: string }) => {
    const data = await sql<Condition>`SELECT condition_name, duration, impact FROM Conditions WHERE character_id = ${character_id}`;
    const conditions = data.rows;
    const noConditions = conditions.length < 1;

    return (
        <div className="conditions">
            <h2 className='text-2xl'>Conditions</h2>
            {noConditions && <p>No conditions.</p>}
            {!noConditions &&
                <ul>
                    {conditions.map(condition => (
                        <li key={condition.condition_id}>
                            {condition.condition_name} (Duration: {condition.duration} rounds)
                            <p>{condition.impact}</p>
                        </li>
                    ))}
                </ul>
            }
        </div>
    );
};

export default ConditionsList;
