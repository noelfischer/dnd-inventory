"use client"

import { ACTIONS } from "@/lib/definitions";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Dictionary } from "../dictionaries";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });

const Tour = ({ name, dict }: { name: string, dict: Dictionary }) => {
    const [run, setRun] = useState(false);
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (typeof window !== "undefined" && !localStorage.getItem("hasSeenAllCampaignsTour")) {
            setRun(true);
        }
    }, []);
    const steps = [
        {
            target: ".username",
            content: <span>{dict.tour.welcome}{name ? `, ${name}` : ""}!<br /> {dict.tour.t0.content1}</span>,
        },
        {
            target: ".banner",
            content: dict.tour.t0.content2,
        },
        {
            target: ".new-campaign",
            content: <span>{dict.tour.t0.content3}<br />{dict.tour.t0.content4}</span>,
        },
        {
            target: ".dark-mode",
            content: dict.tour.t0.content5,
        },
    ];

    const handleJoyrideCallback = (data: any) => {
        const { action } = data;
        if (step != data.index + 1) {
            setStep(data.index + 1);
        }
        if (action === ACTIONS.CLOSE || action === ACTIONS.SKIP || action === ACTIONS.RESET) {
            localStorage.setItem("hasSeenAllCampaignsTour", "true");
            setRun(false);
        }
    }

    return run ? (

        <Joyride
            steps={steps}
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            locale={{
                last: dict.tour.last, skip: dict.tour.skip, next: dict.tour.next, back: dict.tour.back, nextLabelWithProgress: `${dict.tour.next} (${dict.tour.step} ${step} ${dict.tour.of} ${steps.length})`
            }}
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

export default Tour;