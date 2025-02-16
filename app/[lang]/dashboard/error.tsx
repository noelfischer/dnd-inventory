'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <main className="flex h-full flex-col items-center justify-center">
            <div className="border-b-4 border-indigo-500 mb-5 mt-7 "><h2 className="text-center text-xl mb-1">Something went wrong!</h2></div>
            <p>Error: {error.message}</p>
            <div className="flex mt-5">
                <button
                    className="rounded-md bg-indigo-500 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-400"
                    onClick={() => reset()}
                >
                    Try again
                </button>
                <span className="ml-4 flex items-center">
                    or
                    <Link href="/campaigns" className="ml-4 rounded-md bg-indigo-500 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-400">
                        Go Back to Campaigns
                    </Link>
                </span>
            </div>
        </main>
    );
}