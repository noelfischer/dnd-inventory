import { deleteCharacter } from '@/lib/actions';
import { fetchCampaign, fetchCharacter } from '@/lib/data';
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
import { Trash2 } from 'lucide-react';
import { Campaign } from '@prisma/client';

export default async function Page(props: { params: Promise<{ id: string, characterId: string }> }) {
  const params = await props.params;
  const campaignID = params.id;
  const characterID = params.characterId;

  const campaign: Campaign = await fetchCampaign(campaignID);
  if (!campaign) {
    notFound();
  }
  const character = await fetchCharacter(characterID);
  if (!character) {
    notFound();
  }

  const deleteCharacterById = deleteCharacter.bind(null, characterID, campaignID);

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/campaigns">Campaigns</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={`/campaigns/${campaignID}`}>{campaign.name}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Delete {character.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-text text-2xl mb-6 bg-banner banner">
        Delete Character</h1>
      <p className='font-semibold'>{character.name}</p>
      <p>{character.character_type}</p>
      <p>{character.description}</p>
      <p>HP: {character.current_hit_points} / {character.max_hit_points}</p>
      <p>{character.species}</p>
      <Button className='mt-7 w-auto' onClick={deleteCharacterById}>
        <Trash2 className="w-4 mr-3" />
        <span>Delete</span>
      </Button>
    </main>
  );
}