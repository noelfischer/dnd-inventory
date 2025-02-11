"use client"

import { ACTIONS } from "@/lib/definitions";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });


const Tour = ({ name }: { name: string }) => {
    const [run, setRun] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined" && !localStorage.getItem("hasSeenAllCampaignsTour")) {
            setRun(true);
        }
    }, []);
    const steps = [
        {
            target: ".username",
            content: <span>Welcome{name ? `, ${name}` : ""}!<br /> This is your campaigns page, where you can manage your campaigns.</span>,
        },
        {
            target: ".banner",
            content: "These are your campaigns, currently you have none.",
        },
        {
            target: ".new-campaign",
            content: <span>Here you can create a new campaign.<br />Alternatively you can join an existing campaign by requesting an invite link from the DM.</span>,
        },
        {
            target: ".dark-mode",
            content: "Lastly, you can toggle dark mode here. Enjoy!",
        },
    ];

    const handleJoyrideCallback = (data: any) => {
        const { action } = data;
        console.log(data);
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

export default Tour;