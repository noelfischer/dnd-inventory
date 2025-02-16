import { createCharacter } from '@/lib/actions';
import { fetchCampaign, fetchUID } from '@/lib/data';
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
import { getClasses } from '@/lib/utils';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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
            <FormItemTextArea className='col-span-4' classNameTextArea='h-28' name="description" label="Description" placeholder='Choose a character description' />
            <FormItemInput className='col-span-4' name="portrait_url" label="Portrait URL" type="url" Icon={Link} maxLength={255} />
            {isDM ?
              <FormItemSelect className='col-span-2 sm:col-span-1' name="character_type" label="Character Type" classNameLabel='text-text' classNameSelect='h-12' options={[{ key: "Player", value: "Player" }, { key: "NPC", value: "NPC" }, { key: "Enemy", value: "Enemy" }, { key: "Pet", value: "Pet" }]} defaultValue='Player' /> :
              <FormItemSelect className='col-span-2 sm:col-span-1' name="character_type" label="Character Type" classNameLabel='text-text' classNameSelect='h-12' options={[{ key: "Player", value: "Player" }, { key: "Pet", value: "Pet" }]} defaultValue='Player' />}
            <FormItemSelect className='col-span-2 sm:col-span-1' name="cclass" classNameLabel='text-text' classNameSelect='h-12' label="Class" options={getClasses('en')} defaultValue="ar" />
            <FormItemInput className='col-span-4 sm:col-span-2' name="species" label="Species" placeholder='Human' minLength={2} />
            <div className='col-span-4 sm:col-span-2 grid grid-cols-2 items-center gap-4'>
              <FormItemInput className='col-span-2' name="level" label="Level" type="number" defaultValue='1' />
              <FormItemInput className='col-span-2' name="max_hit_points" label="Max hit points" type="number" max={9999} />
              <FormItemInput className='col-span-2' name="armor_class" label="Armor class" type="number" max={50} />
            </div>
            <div className='col-span-4 sm:col-span-2 grid grid-cols-2 items-center gap-4'>
              <FormItemInput className='sm:col-span-1' name="strength" label="Strength (0-20)" type="number" />
              <FormItemInput className='sm:col-span-1' name="dexterity" label="Dexterity" type="number" />
              <FormItemInput className='sm:col-span-1' name="constitution" label="Constitution" type="number" />
              <FormItemInput className='sm:col-span-1' name="intelligence" label="Intelligence" type="number" />
              <FormItemInput className='sm:col-span-1' name="wisdom" label="Wisdom" type="number" />
              <FormItemInput className='sm:col-span-1' name="charisma" label="Charisma" type="number" />
            </div>

          </div>
        </div>
        <Button type="submit" className="w-auto">Create Character</Button>
      </Form>
    </main >
  );
}