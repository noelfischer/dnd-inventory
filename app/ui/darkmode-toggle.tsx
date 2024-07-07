"use client"
import React, { useEffect, useState } from 'react'
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const ToggleDarkMode = () => {
    const { systemTheme, theme, setTheme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState('light');

    useEffect(() => {
        setCurrentTheme( theme === 'system' ? systemTheme : theme);
    }, [theme]);

    const setDarkmode = () => {
        setTheme(currentTheme === "dark" ? "light" : "dark");
    };

    return (
        <div className="flex items-center space-x-2">
            <Switch id="dark-mode" checked={currentTheme == "dark"} onClick={setDarkmode}/>
            <Label htmlFor="dark-mode">Dark Mode</Label>
        </div>
    )
}

export default ToggleDarkMode;
