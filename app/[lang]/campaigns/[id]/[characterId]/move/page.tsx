import { moveCharacter } from '@/lib/actions';
import { fetchCampaigns, fetchCharacter, fetchUID } from '@/lib/data';
import { notFound } from 'next/navigation';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Button from '@/components/Button';
import { Package } from 'lucide-react';
import { FormItemSelect } from '@/app/ui/campaigns/CustomForm';

export default async function Page(props: { params: Promise<{ id: string, characterId: string }> }) {
    const params = await props.params;
    const campaignID = params.id;
    const characterID = params.characterId;

    const character = await fetchCharacter(characterID);
    if (!character) {
        notFound();
    }
    const uID = await fetchUID();
    const campaigns = await fetchCampaigns(uID);
    const campaign = campaigns.find(campaign => campaign.campaign_id === campaignID) || campaigns[0];

    const moveCharacterById = moveCharacter.bind(null, characterID, campaignID);

    return (
        <main>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem><BreadcrumbLink href="/campaigns">Campaigns</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbLink href={`/campaigns/${campaignID}`}>{campaign.name}</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbPage>Move {character.name}</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-text text-2xl mb-6 bg-banner banner">
                Move Character</h1>

            <p className='mb-4'>Do you want to move <b>{character.name}</b> to a different campaign?</p>

            <form action={moveCharacterById}>
                <FormItemSelect name="new_campaign_id" label="Choose campaign" defaultValue={campaignID} className='w-max'
                    options={campaigns.map(campaign => ({ key: campaign.campaign_id, value: campaign.name }))} />
                <Button type="submit" className='mt-7 w-auto'>
                    <Package className="w-5 mr-3" />
                    <span>Move</span>
                </Button>
            </form>
        </main>
    );
}