"use client"
import React, { useEffect, useState } from 'react'
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label"
import { MoonStar, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button"

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
        setTimeout(() => {
            setIsSpinning(false);
        }, 300); // Duration should match the animation duration
    };

    return (
        <div className="flex items-center space-x-2 absolute top-7 right-7">
            <Button variant="ghost" id="dark-mode" size="icon" onClick={setDarkmode} className={"rounded-full ease-out duration-100 " + (isSpinning ? 'animate-spin-once' : '')}>
                <MoonStar className={"absolute w-7 h-7 py-0.5 ease-out duration-100" + (currentTheme == "dark" ? " opacity-100" : " opacity-0")} />
                <Sun className={"absolute w-7 h-7 ease-out duration-100" + (currentTheme == "dark" ? " opacity-0" : " opacity-100")} />
            </Button>
            <Label className="sr-only" htmlFor="dark-mode">Dark Mode</Label>
        </div>
    )
}

export default ToggleDarkMode;
