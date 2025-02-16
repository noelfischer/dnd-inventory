import 'server-only'
import enDict from './dictionaries/en.json'

export type Locale = 'en' | 'de' | 'it' | 'fr'

const dictionaries = {
    en: () => import('./dictionaries/en.json').then((module) => module.default),
    de: () => import('./dictionaries/de.json').then((module) => module.default),
    it: () => import('./dictionaries/it.json').then((module) => module.default),
    fr: () => import('./dictionaries/fr.json').then((module) => module.default),
}


export const getDictionary = async (locale: Locale) =>
    dictionaries[locale]()

export type Dictionary = typeof enDict


export const getDictFromParams = async (params: Promise<{ lang: Locale }>) => {
    const lang = (await params).lang
    return dictionaries[lang]()
}