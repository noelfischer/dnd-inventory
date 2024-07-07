import { createCampaign, deleteCampaign, deleteCharacter, updateCampaign } from '@/app/lib/actions';
import { fetchCampaign, fetchCharacterName } from '@/app/lib/data';
import { Campaign } from '@/app/lib/definitions';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { TrashIcon } from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string, characterId: string } }) {
  const campaignID = params.id;
  const characterID = params.characterId;

  const campaign: Campaign = await fetchCampaign(campaignID);
  if (!campaign) {
    notFound();
  }
  const characterName = await fetchCharacterName(characterID);
  if (!characterName) {
    notFound();
  }

  const deleteCharacterById = deleteCharacter.bind(null, characterID, campaignID);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Campaigns', href: '/campaigns' },
          {
            label: campaign.name,
            href: '/campaigns/' + campaignID,
          },
          {
            label: 'Delete Character',
            href: '/campaigns/' + campaignID + '/' + characterID + '/delete',
            active: true,
          },
        ]}
      />
      <h2>Delete Character:</h2>
      <h1 className="text-3xl mt-3 mb-5">{characterName}</h1>
      <form action={deleteCharacterById}>
        <div className="flex items-center gap-5 self-start">
          <button type="submit" className="flex gap-2 rounded-md border p-2 hover:bg-gray-100">
            <span>Delete</span>
            <TrashIcon className="w-4" />
          </button>
        </div>
      </form>
    </main>
  );
}