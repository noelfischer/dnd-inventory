'use client'

import { useEffect, useState } from "react";

const NameAndLevelClient = ({ name, cclass, il }: { name: string, cclass: string, il: number }) => {
    const [level, setLevel] = useState(il);

    function updateLevel(e: any) {
        setLevel(e.detail.newLevel);
    }

    useEffect(() => {
        window.addEventListener('levelup', updateLevel);
        return () => {
            window.removeEventListener('levelup', updateLevel);
        };
    }, []);

    return (
        <div>
            <h1 className='text-3xl'>{name}, {cclass}, Level {level}</h1>
        </div>
    );
};

export default NameAndLevelClient;