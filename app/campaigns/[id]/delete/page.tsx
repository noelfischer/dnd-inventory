import { deleteCampaign } from '@/app/lib/actions';
import { fetchCampaign } from '@/app/lib/data';
import { Campaign } from '@/app/lib/definitions';
import { TrashIcon } from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default async function Page({ params }: { params: { id: string } }) {
  const campaignID = params.id;

  const campaign: Campaign = await fetchCampaign(campaignID);
  if (!campaign) {
    notFound();
  }

  const deleteCampaignWithId = deleteCampaign.bind(null, campaignID, campaign.dm_id);

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/campaigns">Campaigns</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={`/campaigns/${campaignID}`}>{campaign.name}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Delete</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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