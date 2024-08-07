import { createCampaign } from '@/app/lib/actions';
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


export default function Page() {

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/campaigns">Campaigns</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Create</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Form action={createCampaign} close='/campaigns'>
        <h1 className="text-text text-2xl mb-6">Create Campaign</h1>
        <FormItemInput name="name" label="Choose a campaign name" minLength={2} />
        <FormItemTextArea name="description" label="Choose a campaign description" />
        <FormItemInput name="password" label="Choose a campaign access password" Icon={ShieldPlus} />
        <Button type="submit" className="w-auto">Create Campaign</Button>
      </Form>

    </main>
  );
}