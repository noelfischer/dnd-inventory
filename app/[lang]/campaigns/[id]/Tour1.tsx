"use client"

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { ACTIONS, Placement } from "@/lib/definitions";
import { Dictionary } from "../../dictionaries";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });


const Tour1 = ({ dict }: { dict: Dictionary }) => {
    const [run, setRun] = useState(false);
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (typeof window !== "undefined" && !localStorage.getItem("hasSeenCampaignTour")) {
            setRun(true);
        }
    }, []);
    const steps = [
        {
            target: ".actions",
            content: dict.tour.t1.content1,
            placementBeacon: "top-end" as Placement,
        },
        {
            target: ".invite-link",
            content: dict.tour.t1.content2,
        },
        {
            target: ".handle-access",
            content: dict.tour.t1.content3,
        },
        {
            target: ".update-campaign",
            content: dict.tour.t1.content4,
        },
        {
            target: ".new-character",
            content: dict.tour.t1.content5,
        },
    ];

    const handleJoyrideCallback = (data: any) => {
        const { action } = data;
        if (step != data.index + 1) {
           setStep(data.index + 1);
        }
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
            locale={{ last: dict.tour.last, skip: dict.tour.skip, next: dict.tour.next, back: dict.tour.back, nextLabelWithProgress: `${dict.tour.next} (${dict.tour.step} ${step} ${dict.tour.of} ${steps.length})` }}
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