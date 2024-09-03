'use client'
import { useEffect, useState } from 'react';
import OnLeaveInput from '../helper/OnLeaveInput';
import { cn } from '@/lib/utils';
import { TriangleAlert } from 'lucide-react';

interface Props {
    max_weight: number;
    inventory_weight: number;
    coins_weight: number;
    updateTotalCarriableWeight: (weight: number) => Promise<void>;
}

const WeightClient = ({ max_weight, inventory_weight, coins_weight, updateTotalCarriableWeight }: Props) => {
    const [maxWeight, setMaxWeight] = useState<number>(max_weight);
    const [inventoryWeight, setInventoryWeight] = useState<number>(parseFloat(inventory_weight.toString()));
    const [coinsWeight, setCoinsWeight] = useState<number>(parseFloat(coins_weight.toString()));

    useEffect(() => {
        setMaxWeight(max_weight);
        setInventoryWeight(parseFloat(inventory_weight.toString()));
        setCoinsWeight(parseFloat(coins_weight.toString()));
    }, [inventory_weight, coins_weight, max_weight]);

    const currentWeightPercentage = Math.min(Math.max(0, ((inventoryWeight + coinsWeight) / maxWeight) * 100), 100);
    const encumbered = (inventoryWeight + coinsWeight) > maxWeight;

    useEffect(() => {
        function handleCoinsChange(e: any) {
            setCoinsWeight(parseFloat(e.detail));
        }
        function handleInventoryChange(e: any) {
            setInventoryWeight(parseFloat(e.detail));
        }
        window.addEventListener('coinsWeight', handleCoinsChange);
        window.addEventListener('inventoryWeight', handleInventoryChange);
        return () => {
            window.removeEventListener('coinsWeight', handleCoinsChange);
            window.removeEventListener('inventoryWeight', handleInventoryChange);
        };
    }, []);

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
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-white font-bold text-2xl whitespace-nowrap">
                    {encumbered && <TriangleAlert className='w-10 h-10 mr-5' />}
                    {(inventoryWeight + coinsWeight)} / <OnLeaveInput initialValue={maxWeight.toString()} placeholder='Max HP' onLeave={onChangeMaxWeight} /> lb.
                    {encumbered && <TriangleAlert className='w-10 h-10 ml-4' />}
                </div>
            </div>
        </div>
    );
};

export default WeightClient;
