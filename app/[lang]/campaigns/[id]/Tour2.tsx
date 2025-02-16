"use client"

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { ACTIONS, Placement } from "@/lib/definitions";
import { Dictionary } from "../../dictionaries";


const Joyride = dynamic(() => import("react-joyride"), { ssr: false });


const Tour2 = ({ dict }: { dict: Dictionary }) => {
    const [run, setRun] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined" && !localStorage.getItem("hasSeenCharacterTour")) {
            setRun(true);
        }
    }, []);
    const steps = [
        {
            target: ".character-title:first-of-type",
            content: dict.tour.t2.content1,
            placementBeacon: "top-end" as Placement,
        },
        {
            target: ".view-character-dashboard:first-of-type",
            content: dict.tour.t2.content2,
        },
        {
            target: ".update-character:first-of-type",
            content: dict.tour.t2.content3,
        },
        {
            target: ".delete-character:first-of-type",
            content: dict.tour.t2.content4,
        },
        {
            target: ".dropdown-character-options:first-of-type",
            content: dict.tour.t2.content5,
        },
        {
            target: ".view-party-dashboard",
            content: dict.tour.t2.content6,
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
            locale={{ last: dict.tour.last, skip: dict.tour.skip, next: dict.tour.next, back: dict.tour.back }}
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