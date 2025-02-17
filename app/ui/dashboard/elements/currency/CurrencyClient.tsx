'use client'

import { useDictionary } from "@/app/[lang]/DictionaryProvider";
import OnLeaveInput from "../helper/OnLeaveInput";
import { cn } from "@/lib/utils";
import { Currency } from "@prisma/client";
import { useEffect, useState } from "react";

interface Props {
    initial_currency: Currency;
    updatePlatinum: (value: number) => void;
    updateGold: (value: number) => void;
    updateSilver: (value: number) => void;
    updateCopper: (value: number) => void;
}

const CurrencyClient = ({ initial_currency, updatePlatinum, updateGold, updateSilver, updateCopper }: Props) => {

    const [currency, setCurrency] = useState<Currency>(initial_currency);
    const dictionary = useDictionary()

    useEffect(() => {
        setCurrency(initial_currency);
    }, [initial_currency]);

    function updateCoinage(value: string, coin: keyof Currency) {
        const amount = parseInt(value);
        if (isNaN(amount)) return;
        const updated_currency = { ...currency, [coin]: amount };
        const event = new CustomEvent('coinsWeight', { detail: calcWeight(updated_currency) });
        window.dispatchEvent(event);
        setCurrency(updated_currency);
        return amount;
    }

    function onChangePlatinum(value: string) {
        const amount = updateCoinage(value, 'platin');
        if (amount) updatePlatinum(amount);
    }

    function onChangeGold(value: string) {
        const amount = updateCoinage(value, 'gold');
        if (amount) updateGold(amount);
    }

    function onChangeSilver(value: string) {
        const amount = updateCoinage(value, 'silver');
        if (amount) updateSilver(amount);
    }


    function onChangeCopper(value: string) {
        const amount = updateCoinage(value, 'copper');
        if (amount) updateCopper(amount);
    }


    const ListItem = ({ value, label, onLeave, className }: { value: number, label: string, onLeave: (value: string) => void, className?: string }) => {
        return (
            <li key={label} className='text-text p-1 w-1/2 -m-1 min-w-28 w-32 grow'>
                <div className={cn('rounded-md m-0 border-2 border-black dark:border-black shadow-light dark:shadow-dark', className)}>
                    <div className={cn((label === "Platinum" || label == "Gold" ? 'card-shine-effect' : ''), "rounded-md transition-all bg-main/70 hover:bg-main/0")}>
                        <div className='text-center pt-2'>{label}</div>
                        <div className='border-b-2 border-black mt-3 mb-3'></div>
                        <div className='flex justify-center'><OnLeaveInput className='dark:text-text dark:border-black text-3xl pb-9 border-b-[4px] mb-6' onLeave={onLeave} initialValue={value.toString()} /></div>
                    </div>
                </div>
            </li>
        );
    }

    return (
        <div className="currency m-1">
            <ul className="flex flex-row gap-2 flex-wrap">
                <ListItem value={currency.platin} label={dictionary.dashboard.platinum} className='platinum' onLeave={onChangePlatinum} />
                <ListItem value={currency.gold} label={dictionary.dashboard.gold} className='gold' onLeave={onChangeGold} />
                <ListItem value={currency.silver} label={dictionary.dashboard.silver} className='silver' onLeave={onChangeSilver} />
                <ListItem value={currency.copper} label={dictionary.dashboard.copper} className='copper' onLeave={onChangeCopper} />
            </ul>
        </div>
    );
};

function calcWeight(currency: Currency) {
    return (currency.platin + currency.gold + currency.silver + currency.copper) * 0.02
}

export default CurrencyClient;
