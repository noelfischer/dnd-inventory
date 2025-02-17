"use client"

import { useEffect } from "react"
import { Dictionary, Locale } from "./dictionaries"

const DictClient = ({ dictPromise, params }: { params: Promise<{ lang: Locale }>, dictPromise: Promise<Dictionary> }) => {
    async function saveLocaleToLocalStorage() {
        const { lang } = await params
        const storageLang = localStorage.getItem('lang')
        if (storageLang === lang) return
        localStorage.setItem('lang', lang)
        console.log('dictP', dictPromise)
        const dict = await dictPromise
        console.log('dict', dict)
        localStorage.setItem('dict', JSON.stringify(dict))
    }
    useEffect(() => {
        saveLocaleToLocalStorage()
    }, [])
    return null
}

export default DictClient