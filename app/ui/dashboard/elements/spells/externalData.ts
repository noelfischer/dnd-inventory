'use client'

// Type definitions for the spell data
interface SpellDataDE {
    id: string;
    name: string;
    school: string;
    level: string;
    time: string;
    range: string;
    components: string;
    "material-components": string;
    duration: string;
    description: {
        text: string;
        "text-full"?: string;
        html?: string;
    };
}

interface SpellDataEN {
    index: string;
    name: string;
    school: {
        name: string;
    };
    level: number;
    casting_time: string;
    range: string;
    components: string[];
    material: string;
    duration: string;
    desc: string[];
}

// Type definition for the formatted spell object
export interface FormattedSpell {
    id: string;
    name: string;
    school: string;
    level: string;
    time: string;
    range: string;
    components: string;
    material_components: string;
    duration: string;
    description: string;
}

// Function to fetch and format a spell based on the language
export async function fetchSpell(spellName: string, lang: 'de' | 'en'): Promise<FormattedSpell> {
    // Define the URLs for both languages
    const urls = {
        de: `https://openrpg.de/srd/5e/de/api/spell/${spellName}/json`,
        en: `https://www.dnd5eapi.co/api/spells/${spellName.toLowerCase().replace(/ /g, '-')}`
    };

    // Local storage key based on language and spell name
    const storageKey = `${lang}-${spellName}`;

    // Check if the spell is already cached in localStorage
    const cachedSpell = localStorage.getItem(storageKey);
    if (cachedSpell) {
        console.log("Spell fetched from cache:", spellName);
        return JSON.parse(cachedSpell) as FormattedSpell;
    }

    try {
        // Fetch the spell data from the API
        const response = await fetch(urls[lang]);
        if (!response.ok) throw new Error(`Failed to fetch ${lang} spell: ${response.statusText}`);

        const spellData: SpellDataDE | SpellDataEN = await response.json();

        // Initialize formatted spell object
        const formattedSpell: FormattedSpell = {
            id: lang === 'de' ? (spellData as SpellDataDE).id.replace('spell-', '') : (spellData as SpellDataEN).index,
            name: spellData.name,
            school: lang === 'de' ? (spellData as SpellDataDE).school : (spellData as SpellDataEN).school.name,
            level: lang === 'de' ? (spellData as SpellDataDE).level + ". Grad" : (spellData as SpellDataEN).level.toString() + "rd-level",
            time: lang === 'de' ? "Zeitaufwand:" + (spellData as SpellDataDE).time : "Casting Time: " + (spellData as SpellDataEN).casting_time,
            range: lang === 'de' ? "Reichweite: " + spellData.range : "Range: " + spellData.range,
            components: lang === 'de' ? "Komponenten: " + (spellData as SpellDataDE).components : "Components: " + (spellData as SpellDataEN).components.join(', '),
            material_components: lang === 'de' ? (spellData as SpellDataDE)["material-components"] : (spellData as SpellDataEN).material,
            duration: lang === 'de' ? "Wirkungsdauer: " + spellData.duration : "Duration: " + spellData.duration,
            description: lang === 'de' ? (spellData as SpellDataDE).description.text : (spellData as SpellDataEN).desc.join(" ")
        };

        // Cache the formatted spell in localStorage
        localStorage.setItem(storageKey, JSON.stringify(formattedSpell));

        // Return the formatted spell
        return formattedSpell;
    } catch (error) {
        console.error("Error fetching the spell:", error);

        const formattedSpell: FormattedSpell = {
            id: "error",
            name: spellName,
            school: "Error",
            level: "Error",
            time: "Error",
            range: "Error",
            components: "Error",
            material_components: "Error",
            duration: "Error",
            description: lang === 'de' ? "Fehler beim Abrufen des Zaubers" : "Error fetching the spell"
        };

        return formattedSpell;
    }
}
