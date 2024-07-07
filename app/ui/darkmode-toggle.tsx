"use client"
import React from 'react'
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const ToggleDarkMode = () => {
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;

    const setDarkmode = () => {
        setTheme(currentTheme === "dark" ? "light" : "dark");
    };

    return (
        <div className="flex items-center space-x-2">
            <Switch id="dark-mode" checked={theme == "dark"} onClick={setDarkmode} />
            <Label htmlFor="dark-mode">Dark Mode</Label>
        </div>
    )
}

export default ToggleDarkMode;
