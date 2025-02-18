import { createCampaign } from '@/lib/actions';
import { Form, FormItemInput, FormItemTextArea } from '@/app/ui/campaigns/CustomForm';
import Button from "@/components/Button"
import { ShieldPlus } from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getDictFromParams, Locale } from '../../dictionaries';


export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const dict = await getDictFromParams(params)

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/campaigns">{dict.general.campaigns}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{dict.general.create}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Form action={createCampaign} close='/campaigns'>
        <h1 className="text-text text-2xl mb-6">{dict.createCampaign.create}</h1>
        <FormItemInput name="name" label={dict.createCampaign.name} minLength={2} placeholder={dict.general.name} />
        <FormItemTextArea name="description" label={dict.createCampaign.description} placeholder={dict.general.description} />
        <FormItemInput name="password" label={dict.createCampaign.accessPassword} Icon={ShieldPlus} placeholder={dict.general.password} />
        <Button type="submit" className="w-auto">{dict.createCampaign.create}</Button>
      </Form>

    </main>
  );
}