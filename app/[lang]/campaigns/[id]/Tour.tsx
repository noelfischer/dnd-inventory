'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Dictionary } from '../../dictionaries';

const Tour1 = dynamic(() => import('./Tour1'), { ssr: false });
const Tour2 = dynamic(() => import('./Tour2'), { ssr: false });

const Tour = ({ isDM, characterLength, dict }: { isDM: boolean, characterLength: number, dict: Dictionary }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(typeof window !== 'undefined'); // Ensures this runs only in the browser

    }, []);

    if (!isClient) return null; // Prevents rendering on the server

    return (
        <>
            {isDM && characterLength === 0 && <Tour1 dict={dict} />}
            {characterLength > 0 && <Tour2 dict={dict} />}
        </>
    );
};

export default Tour;