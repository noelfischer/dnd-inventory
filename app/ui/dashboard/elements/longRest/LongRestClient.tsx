'use client'

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Lock, Sunset, Unlock } from "lucide-react";
import { useState } from "react";

const LongRestClient = ({ longRest }: { longRest: () => Promise<void>; }) => {
    const [rightDisabled, setRightDisabled] = useState(true);

    function handleLeft() {
        setRightDisabled(!rightDisabled);
    }

    function handleRight() {
        const event = new CustomEvent('longRest');
        window.dispatchEvent(event);
        setRightDisabled(true);
        longRest();
    }


    return (
        <div className="flex h-full">
            <Button
                className={cn("rounded-none px-4 border-0 border-r-4 -ml-0.5 py-2 h-full transition-all z-20")}
                onClick={handleLeft} size="lg" variant="noShadow"
            >
                {rightDisabled ? <Lock /> : <Unlock />}
            </Button>

            <div className={cn("h-full w-full")}>
                <div className={cn(
                    "h-full w-full transition-transform duration-300 ease",
                    rightDisabled ? 'scale-90' : 'scale-100',
                )}>
                    <Button
                        className={cn(
                            "rounded-r-lg rounded-l-none pr-4 pl-2 py-2 h-full w-[120%] translate-x-[-10%] text-2xl"
                        )}
                        onClick={handleRight} size="lg" disabled={rightDisabled} variant="noShadow"
                    >
                        <Sunset className=" mr-3 h-7 w-7" /> Trigger Long Rest
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default LongRestClient;