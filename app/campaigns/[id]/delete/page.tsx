import { deleteCampaign } from '@/app/lib/actions';
import { fetchCampaign } from '@/app/lib/data';
import { Campaign } from '@/app/lib/definitions';
import { notFound } from 'next/navigation';
import Button from "@/components/Button"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Trash2 } from 'lucide-react';

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
      <h1 className="text-text text-2xl mb-6 bg-red-500 banner font-semibold">
        Delete Campaign
        </h1>
      <h2>Name: {campaign.name}</h2>
      <p>Description: {campaign.description}</p>
      <form action={deleteCampaignWithId}>
          <Button type="submit" className='mt-7 bg-red-500 w-auto'>
            <Trash2 className="w-5 mr-3" />
            <span>Delete</span>
          </Button>
      </form>
    </main>
  );
}