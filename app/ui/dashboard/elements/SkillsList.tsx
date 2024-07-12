import { Skill } from '@/app/lib/definitions';
import { sql } from '@vercel/postgres';
import { notFound } from 'next/navigation';

const SkillsList = async ({ character_id }: { character_id: string }) => {
    const data = await sql<Skill>`SELECT skill_name, proficiency FROM Skills WHERE character_id = ${character_id}`;
    const skills = data.rows;
    if (skills.length === 0) {
        notFound();
    }

    return (
        <div className="skills">
            <h2 className='text-2xl'>Skills</h2>
            <ul>
                {skills.map(skill => (
                    <li key={skill.skill_id}>
                        {skill.skill_name} {skill.proficiency ? '(Proficient)' : ''}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SkillsList;
