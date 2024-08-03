'use client'

import { ClassValue } from 'clsx'

import { cn } from '@/lib/utils'

type Props = {
    className?: ClassValue
    value?: string
    id?: string
    readOnly?: boolean
    setValue?: React.Dispatch<React.SetStateAction<string>>
    type?: string
    min?: number
    max?: number
    name?: string
    defaultValue?: string | number
    maxLength?: number
    minLength?: number
    required?: boolean
    placeholder?: string
}

export default function Input({
    className,
    value,
    id,
    readOnly = false,
    setValue,
    type = 'text',
    min,
    max,
    name,
    defaultValue,
    maxLength,
    minLength,
    required,
    placeholder,
}: Props) {
    return (
        <input
            className={cn(
                'w-full rounded-base bg-white dark:bg-darkBg border-2 border-border dark:border-darkBorder p-[10px] font-base ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 outline-none',
                className,
            )}
            type={type}
            placeholder={placeholder}
            value={value}
            id={id}
            min={min}
            max={max}
            name={name}
            defaultValue={defaultValue}
            maxLength={maxLength}
            minLength={minLength}
            required={required}
            readOnly={readOnly}
            onChange={(e) => {
                if (setValue)
                    setValue(e.target.value)
            }}
            aria-label={placeholder}
        />
    )
}