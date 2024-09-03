'use client'
import { useEffect, useState } from 'react';
import OnLeaveInput from '../helper/OnLeaveInput';
import { cn } from '@/lib/utils';
import { TriangleAlert } from 'lucide-react';

interface Props {
    max_weight: number;
    current_weight: number;
    updateTotalCarriableWeight: (weight: number) => Promise<void>;
}

const WeightClient = ({ max_weight, current_weight, updateTotalCarriableWeight }: Props) => {

    const [currentWeight, setCurrentWeight] = useState<number>(current_weight);
    const [maxWeight, setMaxWeight] = useState<number>(max_weight);

    useEffect(() => {
        setCurrentWeight(current_weight);
        setMaxWeight(max_weight);
    }, [current_weight, max_weight]);

    const currentWeightPercentage = Math.min(Math.max(0, (currentWeight / maxWeight) * 100), 100);
    const encumbered = currentWeight > maxWeight;

    function onChangeMaxWeight(weight: string) {
        const weightNumber = parseInt(weight);
        if (isNaN(weightNumber)) return;
        setMaxWeight(weightNumber);
        updateTotalCarriableWeight(weightNumber);
    }

    return (
        <div className="w-full h-full">
            <div className="relative w-full h-full">
                <div className={cn("relative top-0 left-0 h-full bg-yellow-800", encumbered && "encumbered")} style={{ width: `${currentWeightPercentage}%` }}>
                    <div className='h-full bg-main/20' />
                </div>
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-white font-bold text-2xl">
                    {encumbered && <TriangleAlert className='w-10 h-10 mr-5' />}
                    {currentWeight} / <OnLeaveInput initialValue={maxWeight.toString()} placeholder='Max HP' onLeave={onChangeMaxWeight} /> lb.
                    {encumbered && <TriangleAlert className='w-10 h-10 ml-4' />}
                </div>
            </div>
        </div>
    );
};

export default WeightClient;
