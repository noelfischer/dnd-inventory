'use client'

import { useEffect, useState } from "react";


export default async function InviteLink({ link }: { link: string }) {
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
        <div>
            <button className="bg-blue-500 hover:bg-blue-400 text-white py-2.5 px-3 rounded-lg transition-colors md:text-base font-medium text-sm" onClick={() => setShowLink(true)} hidden={showLink}>
                Invite People to Campaign
            </button>
            <div className="mt-5"><label htmlFor="inviteLink" hidden={!showLink}>The Invite Link can now be copied!</label></div>
            <input id="inviteLink" className="mt-2 p-2 border border-gray-300 rounded w-full" type="text" value={location} readOnly hidden={!showLink} />
        </div>
    )
}
