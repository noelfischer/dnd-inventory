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
import { getDictionary, Locale } from '@/app/[lang]/dictionaries';

export default async function Page(props: { params: Promise<{ id: string, lang: Locale }> }) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  const campaignID = params.id;
  const campaign = await fetchCampaign(campaignID);
  const user_id = await fetchUID();

  const isDM = user_id === campaign.dm_id;


  const createCharacterByCampaignID = createCharacter.bind(null, campaignID);
  return (
    <main>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/campaigns">{dict.general.campaings}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={`/campaigns/${campaignID}`}>{campaign.name}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{dict.character.create}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Form action={createCharacterByCampaignID} close={'/campaigns/' + campaignID}>
        <h1 className="text-text text-2xl mb-3">{dict.character.create}</h1>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <FormItemInput className='col-span-4' name="name" label={dict.character.name} minLength={2} />
            <FormItemTextArea className='col-span-4' classNameTextArea='h-28' name="description" label={dict.general.description} placeholder={dict.character.description} />
            <FormItemInput className='col-span-4' name="portrait_url" label={dict.character.url} type="url" Icon={Link} maxLength={255} />
            {isDM ?
              <FormItemSelect className='col-span-2 sm:col-span-1' name="character_type" label={dict.character.characterType} classNameLabel='text-text' classNameSelect='h-12' options={[{ key: "Player", value: dict.general.player }, { key: "NPC", value: "NPC" }, { key: "Enemy", value: dict.character.enemy }, { key: "Pet", value: dict.character.pet }]} defaultValue='Player' /> :
              <FormItemSelect className='col-span-2 sm:col-span-1' name="character_type" label={dict.character.characterType} classNameLabel='text-text' classNameSelect='h-12' options={[{ key: "Player", value: dict.general.player }, { key: "Pet", value: dict.character.pet }]} defaultValue='Player' />}
            <FormItemSelect className='col-span-2 sm:col-span-1' name="cclass" classNameLabel='text-text' classNameSelect='h-12' label={dict.character.cclass} options={getClasses(params.lang)} defaultValue="ar" />
            <FormItemInput className='col-span-4 sm:col-span-2' name="species" label={dict.character.species} placeholder={dict.character.human} minLength={2} />
            <div className='col-span-4 sm:col-span-2 grid grid-cols-2 items-center gap-4'>
              <FormItemInput className='col-span-2' name="level" label={dict.character.level} type="number" defaultValue='1' />
              <FormItemInput className='col-span-2' name="max_hit_points" label={dict.character.maxHitPoints} type="number" max={9999} />
              <FormItemInput className='col-span-2' name="armor_class" label={dict.character.armorClass} type="number" max={50} />
            </div>
            <div className='col-span-4 sm:col-span-2 grid grid-cols-2 items-center gap-4'>
              <FormItemInput className='sm:col-span-1' name="strength" label={dict.character.strength} type="number" />
              <FormItemInput className='sm:col-span-1' name="dexterity" label={dict.character.dexterity} type="number" />
              <FormItemInput className='sm:col-span-1' name="constitution" label={dict.character.constitution} type="number" />
              <FormItemInput className='sm:col-span-1' name="intelligence" label={dict.character.intelligence} type="number" />
              <FormItemInput className='sm:col-span-1' name="wisdom" label={dict.character.wisdom} type="number" />
              <FormItemInput className='sm:col-span-1' name="charisma" label={dict.character.charisma} type="number" />
            </div>

          </div>
        </div>
        <Button type="submit" className="w-auto">{dict.character.create}</Button>
      </Form>
    </main >
  );
}