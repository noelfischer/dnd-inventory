import { updateCampaign } from '@/app/lib/actions';
import { fetchCampaign } from '@/app/lib/data';
import { Campaign } from '@/app/lib/definitions';
import { notFound } from 'next/navigation';
import { Form, FormItemInput, FormItemTextArea } from '@/app/ui/campaigns/CustomForm';
import { ShieldPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const updateCampaignWithId = updateCampaign.bind(null, campaignID);

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/campaigns">Campaigns</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={`/campaigns/${campaignID}`}>{campaign.name}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Update</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Form action={updateCampaignWithId}>
        <h1 className="text-2xl">Update Campaign</h1>
        <FormItemInput name="name" label="Choose a campaign name" minLength={2} defaultValue={campaign.name} />
        <FormItemTextArea name="description" label="Choose a campaign description" defaultValue={campaign.description} />
        <FormItemInput name="password" label="Choose a campaign access password" defaultValue={campaign.password} Icon={ShieldPlus} />
        <Button type="submit">Update Campaign</Button>
      </Form>
    </main>
  );
}