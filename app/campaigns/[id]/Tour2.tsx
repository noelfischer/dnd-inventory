"use client"

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { ACTIONS, Placement } from "@/lib/definitions";


const Joyride = dynamic(() => import("react-joyride"), { ssr: false });


const Tour2 = () => {
    const [run, setRun] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined" && !localStorage.getItem("hasSeenCharacterTour")) {
            setRun(true);
        }
    }, []);
    const steps = [
        {
            target: ".character-title:first-of-type",
            content: "This is one of your characters. Check out what you can do with it!",
            placementBeacon: "top-end" as Placement,
        },
        {
            target: ".view-character-dashboard:first-of-type",
            content: "Visit your character dashboard to view and manage your character's inventory, stats, and more.",
        },
        {
            target: ".update-character:first-of-type",
            content: "Click here to update your character details.",
        },
        {
            target: ".delete-character:first-of-type",
            content: "Click here to delete your character.",
        },
        {
            target: ".dropdown-character-options:first-of-type",
            content: "Here you can duplicate or move your character to another campaign.",
        },
        {
            target: ".view-party-dashboard",
            content: "Now that you have one or more characters, you can view your party dashboard to see all your characters in one place.",
        }
    ];

    const handleJoyrideCallback = (data: any) => {
        const { action } = data;
        console.log(data);
        if (action === ACTIONS.CLOSE || action === ACTIONS.SKIP || action === ACTIONS.RESET) {
            localStorage.setItem("hasSeenCharacterTour", "true");
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
                    primaryColor: "#5e43bf"
                }
            }}

        />
    ) : <></>;
};

export default Tour2;