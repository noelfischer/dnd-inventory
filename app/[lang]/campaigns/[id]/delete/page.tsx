import { deleteCampaign } from '@/lib/actions';
import { fetchCampaign } from '@/lib/data';
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
import { Campaign } from '@prisma/client';
import { getDictionary, Locale } from '@/app/[lang]/dictionaries';

export default async function Page(props: { params: Promise<{ id: string, lang: Locale }> }) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
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
          <BreadcrumbItem><BreadcrumbLink href="/campaigns">{dict.general.campaigns}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={`/campaigns/${campaignID}`}>{campaign.name}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{dict.general.delete}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-text text-2xl mb-6 bg-red-500 banner font-semibold">
        {dict.delete.title}
      </h1>
      <h2>{dict.general.name}: {campaign.name}</h2>
      <p>{dict.general.description}: {campaign.description}</p>
      <Button className='mt-7 bg-red-500 w-auto' onClick={deleteCampaignWithId}>
        <Trash2 className="w-5 mr-3" />
        <span>{dict.general.delete}</span>
      </Button>
    </main>
  );
}