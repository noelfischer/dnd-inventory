import { createCampaign, deleteCampaign, updateCampaign } from '@/app/lib/actions';
import { fetchCampaign } from '@/app/lib/data';
import { Campaign } from '@/app/lib/definitions';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { TrashIcon } from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const campaignID = params.id;

  const campaign: Campaign = await fetchCampaign(campaignID);
  if (!campaign) {
    notFound();
  }

  const deleteCampaignWithId = deleteCampaign.bind(null, campaignID, campaign.dm_id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Campaigns', href: '/campaigns' },
          {
            label: 'Delete Campaign',
            href: '/campaigns/delete',
            active: true,
          },
        ]}
      />
      <h2>Delete campaign: {campaign.name}</h2>
      <p>{campaign.description}</p>
      <form action={deleteCampaignWithId}>
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