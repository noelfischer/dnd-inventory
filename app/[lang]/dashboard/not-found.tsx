"use client";

import { Frown } from 'lucide-react';
import Link from 'next/link';
import { useDictionary } from '../DictionaryProvider';

export default function NotFound() {
  const dictionary = useDictionary();

  return (
    <main className="flex h-full flex-col items-center justify-center gap-2 mt-5">
      <Frown className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">{dictionary.notFound.title}</h2>
      <p>{dictionary.notFound.dashboardDescription}</p>
      <Link
        href="/campaigns"
        className="mt-4 rounded-md bg-indigo-500 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-400"
      >
        {dictionary.notFound.goBack}
      </Link>
    </main>
  );
}