'use client';

import Button, { LinkButton } from '@/components/Button';
import { logOut } from '@/lib/actions';
import { LogOut } from 'lucide-react';
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
                        <LinkButton className="ml-3 w-auto">
                            Go Back to Campaigns
                        </LinkButton>
                    </Link>

                </span>
                <span className="ml-4 flex items-center">
                    or

                    <form action={logOut} className='ml-4'>
                        <Button className="w-full sm:w-48" type="submit">
                            Logout
                            <LogOut className="w-6 h-6 ml-3" />
                        </Button>
                    </form>
                </span>
            </div>
        </main>
    );
}