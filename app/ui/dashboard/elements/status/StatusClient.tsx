"use client"

import React from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import "./styles.css";
import { Snail } from 'lucide-react';
import { useDictionary } from '@/app/[lang]/DictionaryProvider';

interface Props {
    name: string;
    imgLink: string;
    inspiration: number;
    health: {
        current: number;
        max: number;
    };
    weight:
    {
        current: number;
        max: number;
    };
    spell_slots: { casts_remaining: number }[];
    conditions: string;
}

const StatusClient = ({ name, imgLink, health, weight, spell_slots, conditions, inspiration }: Props) => {
    const dictionary = useDictionary();

    return (
        <>
            <div className="flex flex-row gap-2 pb-1 overflow-hidden" style={{ height: "calc(100% - 70px)" }}>
                <Avatar.Root className="AvatarRoot shadow-light dark:shadow-dark">
                    <Avatar.Image
                        className="AvatarImage character-card-image"
                        src={imgLink}
                        alt={name}
                    />
                    <Avatar.Fallback className="AvatarFallback character-card-image text-5xl font-bold bg-main text-center flex items-center justify-center" delayMs={600}>
                        {name.toUpperCase().slice(0, 3)}
                    </Avatar.Fallback>
                </Avatar.Root>

                <div className='m-2 w-full'>
                    <h2 className='text-3xl mb-3'>{name}</h2>
                    <div className='shadow-light dark:shadow-dark '>
                        <div className="relative w-full bg-red-500 h-12 w-full">
                            <div className="relative top-0 left-0 h-full bg-green-500" style={{ width: `${Math.min(100, (health.current / health.max) * 100)}%` }} />
                            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-white font-bold text-2xl">
                                {health.current} / {health.max}

                            </div>
                        </div>
                        <div className="relative w-full bg-yellow-700/30 h-12 w-full">
                            <div className="relative top-0 left-0 h-full bg-yellow-700" style={{ width: `${Math.max(0, Math.min(100, (weight.current / weight.max) * 100))}%` }} />
                            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-white font-bold text-2xl">
                                {weight.current} / {weight.max} {weight.current > weight.max ? <Snail className="ml-2" /> : null}

                            </div>
                        </div>
                    </div>
                    <div className='border-2 dark:border-white/80 border-black p-2 mt-4' style={{ height: "calc(100% - 152px)", whiteSpace: "pre-wrap" }}>
                        {conditions || "No status conditions"}
                    </div>
                </div>
                <div className='border-2 dark:border-white/80 border-black p-2 text-center shadow-light dark:shadow-dark '>
                    <h2 className='text-2xl mb-3'>{dictionary.dashboard.inspiration}</h2>
                    <div className="content-center" style={{ height: "calc(100% - 55px)" }}>
                        <h1 className='text-8xl font-bold text-center'>{inspiration}</h1>
                    </div>
                </div>
            </div>
            <table className="table-auto mt-4 w-full border-collapse border border-black">
                <tbody>
                    <tr>
                        {spell_slots.map((slot, index) => {
                            const opacity = Math.min(1, (slot.casts_remaining / 10));
                            return (
                                <td key={name+index} className="border-2 dark:border-white/80 border-black text-center text-2xl overflow-hidden">
                                    <div className="relative w-full h-12">
                                        <div className="absolute top-0 left-0 bg-main -m-0.5" style={{ opacity, height: "110%", width: "110%" }} />
                                        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                                            {slot.casts_remaining}
                                        </div>
                                    </div>
                                </td>
                            )
                        })}
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default StatusClient;