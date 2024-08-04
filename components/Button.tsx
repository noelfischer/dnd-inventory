'use client'

import { ClassValue } from 'clsx'

import { cn } from '@/lib/utils'

type Props = {
    className?: ClassValue
    type?: 'button' | 'submit' | 'reset'
    children: React.ReactNode
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export default function Button({ className, type, children, onClick }: Props) {
    return (
        <button
            role="button"
            type={type || 'button'}
            aria-label="Click to perform an action"
            onClick={onClick}
            className={cn(
                'flex justify-between w-full text-text cursor-pointer items-center rounded-base border-2 border-black bg-main px-4 py-2 text-base font-base shadow-light dark:shadow-dark transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none',
                className,
            )}
        >
            {children}
        </button>
    )
}