import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { keyValuePair } from '../ui/campaigns/CustomForm'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  ];

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
  ];

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

