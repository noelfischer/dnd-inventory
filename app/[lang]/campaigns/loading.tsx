"use client";

import { useDictionary } from '../DictionaryProvider';
import './styles.css'

export default function Page() {
  const dictionary = useDictionary();

  return (
    <main className="animate-[shimmer_2s_infinite] text-center text-2xl mt-5 w-full h-full flex items-center justify-center text-gray-400">
      <div className="loader">{dictionary.loading.phrase}</div>
    </main>

  )
}