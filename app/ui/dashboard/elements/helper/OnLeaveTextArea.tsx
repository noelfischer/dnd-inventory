'use client'

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState } from "react";


type Props = {
    initialValue: string,
    placeholder?: string,
    onLeave: (value: string) => void,
    className?: string
}

export default function OnLeaveTextArea({ initialValue, placeholder = '  ', onLeave, className }: Props) {
    const [value, setValue] = useState(initialValue);

    function handleBlur() {
        if (value !== initialValue) {
            // make breaks into new lines
            const serverValue = value.replace(/(?:\r\n|\r|\n)/g, '\n');
            onLeave(serverValue);
        }
    }

    return (
        <Textarea placeholder={placeholder} value={value.toString()} onChange={(e) => setValue(e.target.value)} onBlur={handleBlur} onSubmit={handleBlur} onTouchCancel={handleBlur} className={cn('placeholder:text-zinc-500', className)} />
    );
}