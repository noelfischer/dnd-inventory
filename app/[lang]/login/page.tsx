'use client'

import { useActionState } from 'react';
import { authenticate, loginGoogle } from '@/lib/actions';
import Button from '@/components/Button';
import { ArrowRight, AtSign, CircleAlert, KeyRound, LoaderCircle } from 'lucide-react';
import { FormItemInput } from '../../ui/campaigns/CustomForm';
import Link from 'next/link';
import ToggleDarkMode from '../../ui/darkmode-toggle';
import GoogleButton, { Or } from '../../ui/GoogleButton';

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <main className="flex items-center justify-center sm:h-screen">
      <ToggleDarkMode />
      <div className="relative mx-auto flex w-full sm:max-w-[400px] flex-col mt-[75px] sm:-mt-32">
        <div className="flex-1 sm:rounded-lg bg-main px-6 pb-4 pt-8">
          <h1 className="text-text font-semibold mb-7 text-2xl">
            Please log in to continue.
          </h1>
          <form action={loginGoogle}>
            <GoogleButton />
          </form>
          <Or />

          <form action={formAction}>

            <div className='pb-1'>
              <FormItemInput name='email' label='Email' type='email' placeholder='Enter your email address' minLength={5} Icon={AtSign} className='mb-2' />
              <FormItemInput name='password' label='Password' type='password' placeholder='Enter password' minLength={6} Icon={KeyRound} className='mb-2' />
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
          </form>

          <div className="w-full border-[0.5px] border-black/10 mt-12"></div>
          <div className='flex items-center gap-4 mt-3 justify-between'>
            <p className="text-text">Don&apos;t have an account?</p>
            <Link href="/signup" className="text-text font-semibold">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}