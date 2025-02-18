import { updateCampaign } from '@/lib/actions';
import { fetchCampaign } from '@/lib/data';
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
import { getDictionary, Locale } from '@/app/[lang]/dictionaries';




export default async function Page(props: { params: Promise<{ id: string, lang: Locale }> }) {
  const params = await props.params;
  const campaignID = params.id;
  const dict = await getDictionary(params.lang);

  const campaign: Campaign = await fetchCampaign(campaignID);
  if (!campaign) {
    notFound();
  }

  const updateCampaignWithId = updateCampaign.bind(null, campaignID);

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/campaigns">{dict.general.campaigns}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={`/campaigns/${campaignID}`}>{campaign.name}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{dict.general.update}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Form action={updateCampaignWithId} close={'/campaigns/' + campaignID}>
        <h1 className="text-text text-2xl">{dict.update.title}</h1>
        <FormItemInput name="name" label={dict.createCampaign.name} minLength={2} defaultValue={campaign.name} placeholder={dict.general.name} />
        <FormItemTextArea name="description" label={dict.createCampaign.description} defaultValue={campaign.description} placeholder={dict.general.description} />
        <FormItemInput name="password" label={dict.createCampaign.accessPassword} defaultValue={campaign.password || ''} Icon={ShieldPlus} placeholder={dict.general.password} />
        <Button type="submit" className="w-auto">{dict.update.title}</Button>
      </Form>
    </main>
  );
}