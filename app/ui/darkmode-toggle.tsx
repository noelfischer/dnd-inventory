"use client"
import React from 'react'
import { useTheme } from "next-themes";


const ToggleDarkMode = () => {
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;

    return (
        <button onClick={() => theme == "dark" ? setTheme('light') : setTheme("dark")}>
            Toggle Mode
        </button>
    )
}

export default ToggleDarkMode;
