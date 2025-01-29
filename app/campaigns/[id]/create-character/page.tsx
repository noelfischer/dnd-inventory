import { createCharacter } from '@/app/lib/actions';
import { fetchCampaign, fetchUID } from '@/app/lib/data';
import { Form, FormItemInput, FormItemSelect, FormItemTextArea } from '@/app/ui/campaigns/CustomForm';
import { Link } from 'lucide-react';
import Button from '@/components/Button';


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getClasses } from '@/app/lib/utils';

export default async function Page({ params }: { params: { id: string } }) {
  const campaignID = params.id;
  const campaign = await fetchCampaign(campaignID);
  const user_id = await fetchUID();

  const isDM = user_id === campaign.dm_id;


  const createCharacterByCampaignID = createCharacter.bind(null, campaignID);
  return (
    <main>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/campaigns">Campaigns</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={`/campaigns/${campaignID}`}>{campaign.name}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Create Character</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Form action={createCharacterByCampaignID} close={'/campaigns/' + campaignID}>
        <h1 className="text-text text-2xl mb-3">Create Character</h1>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <FormItemInput className='col-span-4' name="name" label="Choose a character name" minLength={2} />
            <FormItemTextArea className='col-span-4' name="description" label="Choose a character description" />
            <FormItemInput className='col-span-4' name="portrait_url" label="Enter a portrait URL" type="url" Icon={Link} maxLength={255} />
            {isDM ?
              <FormItemSelect className='col-span-2' name="character_type" label="Select character type" classNameLabel='text-text' options={[{ key: "Player", value: "Player" }, { key: "NPC", value: "NPC" }, { key: "Enemy", value: "Enemy" }, { key: "Pet", value: "Pet" }]} defaultValue='Player' /> :
              <FormItemSelect className='col-span-2' name="character_type" label="Select character type" classNameLabel='text-text' options={[{ key: "Player", value: "Player" }, { key: "Pet", value: "Pet" }]} defaultValue='Player' />}
            <FormItemInput className='col-span-2' name="race" label="Choose your race" minLength={2} />
            <FormItemSelect className='col-span-2' name="cclass" classNameLabel='text-text' label="Choose your class" options={getClasses('en')} />
            <FormItemInput className='col-span-2' name="level" label="Choose your level" type="number" defaultValue='1' />
            <FormItemInput className='col-span-2' placeholder='Noble' name="background" label="Choose your background" maxLength={100} />
            <FormItemInput className='col-span-2' placeholder='Lawful Good' name="alignment" label="Choose your alignment" />
            <FormItemInput name="strength" label="Enter your strength (0-20)" type="number" />
            <FormItemInput name="dexterity" label="Enter your dexterity" type="number" />
            <FormItemInput name="constitution" label="Enter your constitution" type="number" />
            <FormItemInput name="intelligence" label="Enter your intelligence" type="number" />
            <FormItemInput name="wisdom" label="Enter your wisdom" type="number" />
            <FormItemInput name="charisma" label="Enter your charisma" type="number" />
            <FormItemInput name="max_hit_points" label="Enter your max hit points" type="number" max={9999} />
            <FormItemInput name="armor_class" label="Enter your armor class" type="number" max={50} />
          </div>
        </div>
        <Button type="submit" className="w-auto">Create Character</Button>
      </Form>
    </main >
  );
}