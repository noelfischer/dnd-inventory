import { Character } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';

const HealthBar = async ({ character_id }: { character_id: string }) => {
    const data = await sql<Character>`SELECT max_hit_points, current_hit_points, temp_hit_points FROM Characters WHERE character_id = ${character_id}`;
    const character = data.rows[0];
    if (!character) {
        notFound();
    }

    const { max_hit_points, current_hit_points, temp_hit_points } = character;
    const totalHitPoints = max_hit_points + temp_hit_points;

    const currentHealthPercentage = Math.min(Math.max(0, ((current_hit_points + temp_hit_points) / max_hit_points) * 100), 100);
    const tempHealthPercentage = Math.max(0, (temp_hit_points / current_hit_points) * 100);
    const remainingHealthPercentage = 100.1 - tempHealthPercentage;

    return (
        <div className="w-full h-full">
            <div className="relative w-full bg-red-500 h-full overflow-hidden">
                <div className="relative top-0 left-0 h-full" style={{ width: `${currentHealthPercentage}%` }}>
                    <div
                        className="absolute top-0 left-0 h-full bg-green-500"
                        style={{ width: `${remainingHealthPercentage}%` }}
                    ></div>
                    <div
                        className="absolute top-0 left-0 h-full bg-blue-500"
                        style={{ width: `${tempHealthPercentage}%`, marginLeft: `${remainingHealthPercentage}%` }}
                    ></div>

                </div>


                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-white font-bold">
                    {current_hit_points}/{max_hit_points} {temp_hit_points > 0 && `(+${temp_hit_points} Temp)`}
                </div>
            </div>
        </div>
    );
};

export default HealthBar;
