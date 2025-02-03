import { updateCampaign } from '@/app/lib/actions';
import { fetchCampaign } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Form, FormItemInput, FormItemTextArea } from '@/app/ui/campaigns/CustomForm';
import { ShieldPlus } from 'lucide-react';
import Button from '@/components/Button';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Campaign } from '@prisma/client';




export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

      <Form action={updateCampaignWithId} close={'/campaigns/' + campaignID}>
        <h1 className="text-text text-2xl">Update Campaign</h1>
        <FormItemInput name="name" label="Choose a campaign name" minLength={2} defaultValue={campaign.name} />
        <FormItemTextArea name="description" label="Choose a campaign description" defaultValue={campaign.description} />
        <FormItemInput name="password" label="Choose a campaign access password" defaultValue={campaign.password || ''} Icon={ShieldPlus} />
        <Button type="submit" className="w-auto">Update Campaign</Button>
      </Form>
    </main>
  );
}