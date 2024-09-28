'use client'

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import DynamicWidthInput from './DynamicWidthInput';

export default function OnLeaveInput({ initialValue, placeholder = '  ', onLeave, className }: { initialValue: string, placeholder?: string, onLeave: (value: string) => void, className?: string }) {
    const [value, setValue] = useState(initialValue);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    function handleBlur() {
        setIsEditing(false);
        if (value !== initialValue)
            onLeave(value);
    }

    return (
        <div className={cn('transition-all hover:scale-125 inline-flex border-dotted border-b-[3px] border-white mt-[2px] mx-1 h-8', className)}>
            <DynamicWidthInput placeholder={placeholder} value={value.toString()} onChange={(e) => setValue(e.target.value)} onEnter={handleBlur} onSubmit={handleBlur} onTouchCancel={handleBlur}
                className={cn('text-white', className, 'border-0 ')}
            />
        </div>
    );
}