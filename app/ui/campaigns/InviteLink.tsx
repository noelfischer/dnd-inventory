'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dices } from "lucide-react";
import { Input } from "@/components/ui/input"

export default function InviteLink({ link }: { link: string }) {
    const [showLink, setShowLink] = useState(false);
    const [location, setLocation] = useState('');

    useEffect(() => {
        // Check if the code is running on the client side
        if (process) {
            // Access the current page URL using window.location
            setLocation(window.location.href + link);
        }
    }, []);

    return (
        <div className="my-5">
            <Button variant="secondary" className={"w-full sm:w-min" + (showLink ? " hidden" : "")} onClick={() => setShowLink(true)}>
                Invite People to Campaign
                <Dices className="w-5 md:w-6 ml-3" />
            </Button>
            <div className="mt-5"><label htmlFor="inviteLink" hidden={!showLink}>The Invite Link can now be copied!</label></div>
            <Input id="inviteLink" type="text" value={location} readOnly className={showLink ? "" : "hidden"} />
        </div>
    )
}
