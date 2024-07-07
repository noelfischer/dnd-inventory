import { updateCampaign } from '@/app/lib/actions';
import { fetchCampaign } from '@/app/lib/data';
import { Campaign } from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import {
  BookOpenIcon, PlusCircleIcon, ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Form, FormItemInput, FormItemTextArea } from '@/app/ui/campaigns/CustomForm';


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
        <FormItemInput name="password" label="Choose a campaign access password" defaultValue={campaign.password} Icon={ShieldCheckIcon} />
        <Button type="submit">Update Campaign</Button>
      </Form>
    </main>
  );
}