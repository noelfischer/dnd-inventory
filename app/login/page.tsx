'use client'

import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import Button from '@/components/Button';
import { AtSign, CircleAlert, KeyRound } from 'lucide-react';
import { FormItemInput } from '../ui/campaigns/CustomForm';
import Link from 'next/link';

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <main className="flex items-center justify-center sm:h-screen">
      <div className="relative mx-auto flex w-full sm:max-w-[400px] flex-col mt-[75px] sm:-mt-32">
        <form action={formAction}>
          <div className="flex-1 sm:rounded-lg bg-main px-6 pb-4 pt-8">
            <h1 className="text-text font-semibold mb-3 text-2xl">
              Please log in to continue.
            </h1>
            <div className='pb-1'>
              <FormItemInput name='email' label='Email' type='email' placeholder='Enter your email address' minLength={5} Icon={AtSign} />
              <FormItemInput name='password' label='Password' type='password' placeholder='Enter password' minLength={6} Icon={KeyRound} />
            </div>
            {errorMessage && (
              <div className='flex gap-3'>
                <CircleAlert className="h-6 w-6 text-text" />
                <p className="text-text">{errorMessage}</p>
              </div>
            )}
            <Button className="mt-5 w-full" aria-disabled={isPending} type='submit' disabled={isPending}>
              Log in <ArrowRightIcon className="h-6 w-6" />
            </Button>
            <div className='flex items-center gap-4 mt-16 justify-between'>
              <p className="text-text">Don't have an account?</p>
              <Link href="/signup" className="text-primary">
                <Button className="w-auto text-sm px-4 py-1.5">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}