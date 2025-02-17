'use client'

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { Dices } from "lucide-react";
import Input from "@/components/Input"
import { Dictionary } from "@/app/[lang]/dictionaries";

export default function InviteLink({ link, dict }: { link: string, dict: Dictionary }) {
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
            <Button className={"invite-link w-full sm:max-w-80" + (showLink ? " hidden" : "")} onClick={() => setShowLink(true)}>
                {dict.campaign.invite}
                <Dices className="w-6" />
            </Button>
            <div className="mt-5"><label htmlFor="inviteLink" hidden={!showLink}>{dict.campaign.inviteSuccess}</label></div>
            <Input id="inviteLink" value={location} readOnly className={"w-full sm:max-w-lg" + (showLink ? "" : " hidden")} />
        </div>
    )
}
