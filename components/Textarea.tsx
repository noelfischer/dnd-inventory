'use client'

import { ClassValue } from 'clsx'
import { cn } from '@/lib/utils'

type Props = {
    className?: ClassValue,
    value?: string,
    setValue?: React.Dispatch<React.SetStateAction<string>>,
    placeholder?: string,
    name?: string,
    id?: string,
    label?: string,
    maxLength?: number,
    minLength?: number,
    defaultValue?: string,
    required?: boolean
}

export default function Textarea({
    className,
    value,
    setValue,
    placeholder,
    name,
    id,
    label,
    maxLength,
    minLength,
    defaultValue,
    required
}: Props) {
    return (
        <textarea
            className={cn(
                'w-full h-[150px] bg-white dark:bg-dark-bg resize-none rounded-base border-2 border-border dark:border-dark-border p-[10px] font-base ring-offset-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 outline-hidden',
                className,
            )}
            placeholder={placeholder}
            value={value}
            name={name}
            id={id}
            maxLength={maxLength}
            minLength={minLength}
            defaultValue={defaultValue}
            readOnly={false}
            required={required}
            onChange={(e) => {
                if (setValue)
                    setValue(e.target.value)
            }}
        ></textarea>
    )
}