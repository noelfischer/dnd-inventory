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
                'w-full h-[150px] bg-white dark:bg-darkBg resize-none rounded-base border-2 border-border dark:border-darkBorder p-[10px] font-base ring-offset-white dark:ring-offset-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border dark:focus-visible:ring-darkBorder focus-visible:ring-offset-2 outline-none',
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