'use client'

import { useActionState } from 'react';
import { loginGoogle, signUp } from '@/lib/actions';
import Button from '@/components/Button';
import { ArrowRight, AtSign, CircleAlert, CircleUserRound, KeyRound, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import GoogleButton, { Or } from '@/app/ui/GoogleButton';
import { FormItemInput } from '@/app/ui/campaigns/CustomForm';
import ToggleDarkMode from '@/app/ui/darkmode-toggle';
import { Dictionary } from '../dictionaries';

const Signup = ({ dict }: { dict: Dictionary }) => {
  const [errorMessage, formAction, isPending] = useActionState(
    signUp,
    undefined,
  );

  return (
    <main className="flex items-center justify-center sm:h-screen">
      <ToggleDarkMode />
      <div className="relative mx-auto flex w-full sm:max-w-[400px] flex-col mt-[75px] sm:-mt-32">
        <div className="flex-1 sm:rounded-lg bg-main px-6 pb-4 pt-8">
          <h1 className="text-text font-semibold mb-7 text-2xl">
            {dict.signup.title}
          </h1>
          <form action={loginGoogle}>
            <GoogleButton text={dict.login.google} />
          </form>
          <Or />
          <form action={formAction}>

            <div className='pb-1'>
              <FormItemInput name='email' label={dict.signup.email} type='email' placeholder={dict.signup.emailPlaceholder} className='mb-2' minLength={5} Icon={AtSign} />
              <FormItemInput name='username' label={dict.signup.username} type='text' placeholder={dict.signup.usernamePlaceholder} className='mb-2' minLength={3} Icon={CircleUserRound} />
              <FormItemInput name='password' label={dict.signup.password} type='password' placeholder={dict.signup.passwordPlaceholder} className='mb-2' minLength={6} Icon={KeyRound} />
            </div>
            {errorMessage && (
              <div className='flex gap-3'>
                <CircleAlert className="h-6 w-6 text-text" />
                <p className="text-text">{errorMessage}</p>
              </div>
            )}
            <Button className="mt-5 w-full" aria-disabled={isPending} type='submit' disabled={isPending}>
              <p className='flex'>
                {dict.signup.title} {isPending && <LoaderCircle className='animate-spin ml-2' />}
              </p>
              <ArrowRight className="h-6 w-6" />
            </Button>
          </form>

          <div className="w-full border-[0.5px] border-black/10 mt-12"></div>
          <div className='flex items-center gap-4 mt-3 justify-between'>
            <p className="text-text">{dict.signup.haveAccount}</p>
            <Link href="/login" className="text-text font-semibold">
              {dict.login.login}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Signup