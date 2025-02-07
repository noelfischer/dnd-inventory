'use client'

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';
import Button from '@/components/Button';
import { ArrowRight, AtSign, CircleAlert, KeyRound, LoaderCircle } from 'lucide-react';
import { FormItemInput } from '../ui/campaigns/CustomForm';
import Link from 'next/link';
import ToggleDarkMode from '../ui/darkmode-toggle';

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <main className="flex items-center justify-center sm:h-screen">
      <ToggleDarkMode />
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
              <p className='flex'>
                Log in {isPending && <LoaderCircle className='animate-spin ml-2' />}
              </p>
              <ArrowRight className="h-6 w-6" />
            </Button>
            <div className='flex items-center gap-4 mt-16 justify-between'>
              <p className="text-text">Don&apos;t have an account?</p>
              <Link href="/signup" className="text-text font-semibold">
                Create Account
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}