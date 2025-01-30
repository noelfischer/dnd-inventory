'use client'
import { useEffect, useState } from 'react';
import OnLeaveInput from '../helper/OnLeaveInput';

interface Props {
    max_hit_points: number;
    current_hit_points: number;
    temp_hit_points: number;
    updateCurrentHealth: (health: number) => Promise<void>;
    updateMaxHealth: (health: number) => Promise<void>;
    updateTempHealth: (health: number) => Promise<void>;
}

const HealthBarClient = ({ max_hit_points, current_hit_points, temp_hit_points, updateCurrentHealth, updateMaxHealth, updateTempHealth }: Props) => {

    const [currentHitPoints, setCurrentHitPoints] = useState<number>(current_hit_points);
    const [tempHitPoints, setTempHitPoints] = useState<number>(temp_hit_points);
    const [maxHitPoints, setMaxHitPoints] = useState<number>(max_hit_points);

    function resetHealth() {
        setCurrentHitPoints(maxHitPoints);
        setTempHitPoints(0);
    }

    function levelup(e: any) {
        setMaxHitPoints(e.detail.maxhitpoints);
        setCurrentHitPoints(e.detail.maxhitpoints);
        setTempHitPoints(0);
    }

    useEffect(() => {
        setCurrentHitPoints(current_hit_points);
        setTempHitPoints(temp_hit_points);
        setMaxHitPoints(max_hit_points);
        window.addEventListener('longRest', resetHealth);
        window.addEventListener('levelup', levelup);

        return () => {
            window.removeEventListener('longRest', resetHealth);
            window.removeEventListener('levelup', levelup);
        };
    }, [current_hit_points, temp_hit_points, max_hit_points]);

    const currentHealthPercentage = Math.min(Math.max(0, (currentHitPoints / maxHitPoints) * 100), 100);
    const tempHealthPercentageFull = Math.max(0, (tempHitPoints / (currentHitPoints + tempHitPoints)) * 100);
    const tempHealthPercentageHit = Math.max(0, (tempHitPoints / maxHitPoints) * 100);

    function onChangeCurrentHealth(health: string) {
        const healthNumber = parseInt(health);
        if (isNaN(healthNumber)) return;
        setCurrentHitPoints(healthNumber);
        updateCurrentHealth(healthNumber);
    }

    function onChangeMaxHealth(health: string) {
        const healthNumber = parseInt(health);
        if (isNaN(healthNumber)) return;
        setMaxHitPoints(healthNumber);
        updateMaxHealth(healthNumber);
    }
    function onChangeTempHealth(health: string) {
        const healthNumber = parseInt(health);
        if (isNaN(healthNumber)) return;
        setTempHitPoints(healthNumber);
        updateTempHealth(healthNumber);
    }

    return (
        <div className="w-full h-full">
            <div className="relative w-full bg-red-500 h-full">
                <div className="relative top-0 left-0 h-full bg-green-500" style={{ width: `${currentHealthPercentage}%` }} />
                {tempHitPoints + currentHitPoints <= maxHitPoints ?
                    <div className="absolute top-0 left-0 h-full bg-blue-500"
                        style={{ width: `${tempHealthPercentageHit}%`, marginLeft: `${currentHealthPercentage}%` }} />
                    :
                    <div className="absolute top-0 right-0 h-full bg-blue-500"
                        style={{ width: `${tempHealthPercentageFull}%` }} />
                }

                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-white font-bold text-2xl dark">
                    <OnLeaveInput initialValue={currentHitPoints.toString()} placeholder='HP' onLeave={onChangeCurrentHealth} />
                    + <OnLeaveInput initialValue={tempHitPoints.toString()} placeholder='Temp HP' onLeave={onChangeTempHealth} /> /
                    <OnLeaveInput initialValue={maxHitPoints.toString()} placeholder='Max HP' onLeave={onChangeMaxHealth} />

                </div>
            </div>
        </div>
    );
};

export default HealthBarClient;
