'use client';

import Link from 'next/link';
import { useDictionary } from '../DictionaryProvider';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const dictionary = useDictionary();

    return (
        <main className="flex h-full flex-col items-center justify-center">
            <div className="border-b-4 border-indigo-500 mb-5 mt-7 "><h2 className="text-center text-xl mb-1">{dictionary.error.title}</h2></div>
            <p>Error: {error.message}</p>
            <div className="flex mt-5">
                <button
                    className="rounded-md bg-indigo-500 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-400"
                    onClick={() => reset()}>
                    {dictionary.error.tryAgain}
                </button>
                <span className="ml-4 flex items-center">
                    {dictionary.general.or}
                    <Link href="/campaigns" className="ml-4 rounded-md bg-indigo-500 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-400">
                        {dictionary.error.goBack}
                    </Link>
                </span>
            </div>
        </main>
    );
}