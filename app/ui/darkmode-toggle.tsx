"use client"
import React, { useEffect, useState } from 'react'
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label"
import { MoonStar, Sun } from 'lucide-react';
import Button from "@/components/Button"

const ToggleDarkMode = () => {
    const { systemTheme, theme, setTheme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState<string | undefined>('light');
    const [isSpinning, setIsSpinning] = useState(false);

    useEffect(() => {
        setCurrentTheme(theme === 'system' ? systemTheme : theme);
    }, [theme]);

    const setDarkmode = () => {
        setIsSpinning(true);
        setTheme(currentTheme === "dark" ? "light" : "dark");
        window.dispatchEvent(new Event("storage"));
        setTimeout(() => {
            setIsSpinning(false);
        }, 300); // Duration should match the animation duration
    };

    return (
        <div className="flex items-center space-x-2 absolute top-6 right-7">
            <button id="dark-mode" onClick={setDarkmode} className={"w-7 h-7 rounded-full ease-out duration-100 " + (isSpinning ? 'animate-spin-once' : '')}>
                <MoonStar className={"absolute top-0 w-7 h-7 py-0.5 ease-out duration-100" + (currentTheme == "dark" ? " opacity-100" : " opacity-0")} />
                <Sun className={"absolute top-0 w-7 h-7 ease-out duration-100" + (currentTheme == "dark" ? " opacity-0" : " opacity-100")} />
            </button>
            <Label className="sr-only" htmlFor="dark-mode">Dark Mode</Label>
        </div>
    )
}

export default ToggleDarkMode;
