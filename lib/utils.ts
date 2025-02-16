import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { prisma } from './prisma';
import { match } from '@formatjs/intl-localematcher'

export type keyValuePair = {
  key: string,
  value: string
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function saltAndHashPassword(password: string): Promise<string> {
  var bcrypt = require('bcryptjs');
  return bcrypt.hash(password, 10);
}

export async function validatePassword(password: string, hash: string | undefined): Promise<boolean> {
  if (hash == undefined) return false;
  var bcrypt = require('bcryptjs');
  return await bcrypt.compare(password, hash);
}

export function getUserFromDb(email: string) {
  return prisma.user.findFirst({
    where: {
      email,
    },
    include: {
      Credential: true,
    },
  });
}

export const getClasses = (lang: 'de' | 'en') => {
  const classesDe: keyValuePair[] = [
    { key: 'bb', value: 'Barbar' },
    { key: 'ba', value: 'Barde' },
    { key: 'dr', value: 'Druide' },
    { key: 'he', value: 'Hexenmeister' },
    { key: 'ka', value: 'Kämpfer' },
    { key: 'kl', value: 'Kleriker' },
    { key: 'ma', value: 'Magier' },
    { key: 'mo', value: 'Mönch' },
    { key: 'pa', value: 'Paladin' },
    { key: 'sc', value: 'Schurke' },
    { key: 'wa', value: 'Waldläufer' },
    { key: 'za', value: 'Zauberer' },
    { key: 'ar', value: 'Magieschmied / Artifizient' },
    { key: 'pe', value: 'Tier' },
  ].sort((a, b) => a.value.localeCompare(b.value));

  const classesEn: keyValuePair[] = [
    { key: 'bb', value: 'Barbarian' },
    { key: 'ba', value: 'Bard' },
    { key: 'dr', value: 'Druid' },
    { key: 'he', value: 'Warlock' },
    { key: 'ka', value: 'Fighter' },
    { key: 'kl', value: 'Cleric' },
    { key: 'ma', value: 'Wizard' },
    { key: 'mo', value: 'Monk' },
    { key: 'pa', value: 'Paladin' },
    { key: 'sc', value: 'Rogue' },
    { key: 'wa', value: 'Ranger' },
    { key: 'za', value: 'Sorcerer' },
    { key: 'ar', value: 'Artificer' },
    { key: 'pe', value: 'Pet' },
  ].sort((a, b) => a.value.localeCompare(b.value));

  return lang === 'de' ? classesDe : classesEn;
}

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};



export const downloadJSON = (jsonObject: any, fileName: string) => {
  const blob = new Blob([JSON.stringify(jsonObject, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);

  // Create a temporary link element to simulate the download
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'data.json';

  // Trigger the download
  a.click();

  // Cleanup
  URL.revokeObjectURL(url);
};

export function handleFileUpload(file: File): Promise<any> {

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const jsonObject = JSON.parse(e.target.result);
        resolve(jsonObject);
      } catch (error) {
        reject("Invalid JSON file");
      }
    };

    reader.onerror = () => reject("Error reading file");
    reader.readAsText(file);
  })
}

export function getLocale(acceptLanguage: string, locales: string[]) {
  const languages = formatAcceptLanguage(acceptLanguage)
  const defaultLocale = 'en'
  const language = match(languages, locales, defaultLocale)
  return language
}

// Formats accepts-language header like this: da, en-gb;q=0.8, en;q=0.7 
// into an array like this ['da', 'en-gb', 'en']
// This function does not handle sorting the q values, since modern browsers send the most preferred language first
function formatAcceptLanguage(acceptLanguage: string): string[] {
  return acceptLanguage.split(',').map((lang) => lang.split(';')[0].trim());
}