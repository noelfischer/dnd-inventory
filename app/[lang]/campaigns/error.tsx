'use client';

import Button, { LinkButton } from '@/components/Button';
import { logOut } from '@/lib/actions';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { useDictionary } from '../DictionaryProvider';

export default function Error({ error, reset, }: { error: Error & { digest?: string }; reset: () => void }) {
    const dictionary = useDictionary();

    return (
        <main className="flex h-full flex-col items-center justify-center">
            <div className="border-b-4 border-main mb-5 mt-7 "><h2 className="text-center text-xl mb-1">{dictionary.error.title}</h2></div>
            <p>Error: {error.message}</p>
            <div className="flex mt-5">
                <Button className="w-auto"
                    onClick={() => reset()}>
                    {dictionary.error.tryAgain}
                </Button>
                <span className="ml-4 flex items-center">
                    {dictionary.general.or}
                    <Link href="/campaigns" className="unset">
                        <LinkButton className="ml-3 w-auto">
                            {dictionary.error.goBack}
                        </LinkButton>
                    </Link>

                </span>
                <span className="ml-4 flex items-center">
                    {dictionary.general.or}
                    <form action={logOut} className='ml-4'>
                        <Button className="w-full sm:w-48" type="submit">
                            {dictionary.general.logout}
                            <LogOut className="w-6 h-6 ml-3" />
                        </Button>
                    </form>
                </span>
            </div>
        </main>
    );
}