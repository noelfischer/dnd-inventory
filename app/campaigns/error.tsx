'use client';

import Button from '@/components/Button';
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
            <div className="border-b-4 border-main mb-5 mt-7 "><h2 className="text-center text-xl mb-1">Something went wrong!</h2></div>
            <p>Error: {error.message}</p>
            <div className="flex mt-5">
                <Button className="w-auto"
                    onClick={() => reset()}
                >
                    Try again
                </Button>
                <span className="ml-4 flex items-center">
                    or

                    <Link href="/campaigns" className="unset">
                        <Button className="ml-3 w-auto">
                            Go Back to Campaigns
                        </Button>
                    </Link>

                </span>
            </div>
        </main>
    );
}