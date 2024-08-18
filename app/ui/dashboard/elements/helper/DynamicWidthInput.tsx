'use client'

import { cn } from '@/lib/utils';
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

interface DynamicWidthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onEnter?: () => void;
    placeholder?: string;
    className?: string;
}

const DynamicWidthInput: React.FC<DynamicWidthInputProps> = ({ value = '', onChange, onEnter, className, placeholder = ' ', ...props
}) => {
    const [inputValue, setInputValue] = useState<string>(value);
    const inputRef = useRef<HTMLInputElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        adjustWidth();
    }, [inputValue]);

    const adjustWidth = () => {
        if (spanRef.current && inputRef.current) {
            spanRef.current.textContent = inputValue == '' ? placeholder : inputValue;
            inputRef.current.style.width = `${spanRef.current.offsetWidth}px`;
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (onChange) onChange(e);
    };

    return (
        <div className="inline-block relative">
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                placeholder={placeholder}
                onChange={handleInputChange}
                onKeyUp={(e) => { if (e.key === 'Enter' && onEnter) onEnter() }}
                onBlur={() => { if (onEnter) onEnter() }}
                className={cn("bg-transparent absolute placeholder:text-white/[.6] placeholder:font-semibold top-0 left-0 w-auto min-w-[15px] max-w-[400px] mx-1 ring-offset-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-offset-2 outline-none", className)}
                {...props}
            />
            <span ref={spanRef} className="invisible whitespace-pre mx-1"></span>
        </div>
    );
};

export default DynamicWidthInput;
