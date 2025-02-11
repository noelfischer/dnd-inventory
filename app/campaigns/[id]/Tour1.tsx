"use client"

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { ACTIONS, Placement } from "@/lib/definitions";


const Joyride = dynamic(() => import("react-joyride"), { ssr: false });


const Tour1 = () => {
    const [run, setRun] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined" && !localStorage.getItem("hasSeenCampaignTour")) {
            setRun(true);
        }
    }, []);
    const steps = [
        {
            target: ".actions",
            content: "Building your first campaign? Don't worry, it's incredibly easy!",
            placementBeacon: "top-end" as Placement,
        },
        {
            target: ".invite-link",
            content: "First, you can invite people to your campaign. Click here to get the invite link.",
        },
        {
            target: ".handle-access",
            content: "People who have joined your campaign can be managed here.",
        },
        {
            target: ".update-campaign",
            content: "Click here to update your campaign details.",
        },
        {
            target: ".new-character",
            content: "Now start by creating a new character. You can create as many as you like!",
        },
    ];

    const handleJoyrideCallback = (data: any) => {
        const { action } = data;
        console.log(data);
        if (action === ACTIONS.CLOSE || action === ACTIONS.SKIP || action === ACTIONS.RESET) {
            localStorage.setItem("hasSeenCampaignTour", "true");
            setRun(false);
        }
    }

    return run ? (

        <Joyride
            steps={steps}
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            locale={{ last: "End tour" }}
            callback={handleJoyrideCallback}
            run={run}
            styles={{
                options: {
                    primaryColor: "#7d66ff"
                }
            }}

        />
    ) : <></>;
};

export default Tour1;