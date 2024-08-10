'use client'

import { ClassValue } from 'clsx'

import { cn } from '@/lib/utils'
import { useState } from 'react'
import { LoaderCircle } from 'lucide-react'

type Props = {
    className?: ClassValue
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    children: React.ReactNode
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export default function Button({ className, type, disabled = false, children, onClick }: Props) {
    return (
        <button
            role="button"
            type={type || 'button'}
            aria-label="Click to perform an action"
            disabled={disabled}
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


export function LinkButton({ className, type, disabled = false, children, onClick }: Props) {
    const [loading, setLoading] = useState(false);
    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        setLoading(true);
        if (onClick)
            onClick(e);
    }
    return (
        <button
            role="button"
            type={type || 'button'}
            aria-label="Click to perform an action"
            disabled={disabled || loading}
            onClick={handleClick}
            className={cn(
                'flex justify-between w-full text-text cursor-pointer items-center rounded-base border-2 border-black bg-main px-4 py-2 text-base font-base shadow-light dark:shadow-dark transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none',
                className,
                { 'opacity-50': disabled || loading }
            )}
        >
            {loading && <LoaderCircle className='animate-spin ml-2' />}
            {children}
        </button>
    )
}