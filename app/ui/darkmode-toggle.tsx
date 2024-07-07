"use client"
import React, { useEffect, useState } from 'react'
import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label"
import { MoonStar, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button"

const ToggleDarkMode = () => {
    const { systemTheme, theme, setTheme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState('light');

    useEffect(() => {
        setCurrentTheme(theme === 'system' ? systemTheme : theme);
    }, [theme]);

    const setDarkmode = () => {
        setTheme(currentTheme === "dark" ? "light" : "dark");
    };

    return (
        <div className="flex items-center space-x-2 absolute top-7 right-7">
            <Button variant="ghost" id="dark-mode" size="icon" onClick={setDarkmode} className='rounded-full'>
                <MoonStar className={"w-7 h-7 py-0.5" + (currentTheme == "dark" ? "" : " hidden")} />
                <Sun className={"w-7 h-7" + (currentTheme == "dark" ? " hidden" : "")} />
            </Button>
            <Label className="sr-only" htmlFor="dark-mode">Dark Mode</Label>
        </div>
    )
}

export default ToggleDarkMode;
