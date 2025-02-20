import { updateCharacter } from '@/lib/actions';
import { fetchCampaign, fetchCharacter, fetchUsersByCampaign, fetchUID } from '@/lib/data';
import { notFound } from 'next/navigation';
import Button from '@/components/Button';
import { Form, FormItemInput, FormItemSelect, FormItemTextArea } from '@/app/ui/campaigns/CustomForm';
import { Link } from 'lucide-react';


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getClasses } from '@/lib/utils';
import { Campaign } from '@prisma/client';
import { getDictionary, Locale } from '@/app/[lang]/dictionaries';

export default async function Page(props: { params: Promise<{ id: string, characterId: string, lang: Locale }> }) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  const campaignID = params.id;
  const characterID = params.characterId;
  const user_id = await fetchUID();

  const campaign: Campaign = await fetchCampaign(campaignID);
  if (!campaign) {
    notFound();
  }
  const character = await fetchCharacter(characterID);
  if (!character) {
    notFound();
  }
  const usersInCampaign = await fetchUsersByCampaign(campaignID);
  if (!usersInCampaign) {
    notFound();
  }
  const isDM = user_id === campaign.dm_id;

  const updateCharacterWithId = updateCharacter.bind(null, characterID, campaignID);

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/campaigns">{dict.general.campaigns}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={`/campaigns/${campaignID}`}>{campaign.name}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{dict.general.update} - {character.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Form action={updateCharacterWithId} close={"/campaigns/" + campaignID}>
        <h1 className="text-2xl text-text">{dict.character.update}</h1>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <FormItemInput className={isDM ? 'col-span-2' : 'col-span-4'} name="name" label={dict.character.name} minLength={2} defaultValue={character.name} placeholder={character.name} />
            <FormItemSelect className='col-span-2' name="user_id" label={dict.character.owner} defaultValue={character.user_id} classNameLabel='text-text'
              options={usersInCampaign.map(user => ({ key: user.user_id, value: user.User.username }))} visible={isDM} />
            <FormItemTextArea className='col-span-4' classNameTextArea='h-28' name="description" label={dict.general.description} placeholder={dict.character.description} defaultValue={character.description || ''} />
            <FormItemInput className='col-span-4' name="portrait_url" label={dict.character.url} placeholder={dict.character.url} type="url" Icon={Link} defaultValue={character.portrait_url || ''} maxLength={255} />
            {isDM ?
              <FormItemSelect className='col-span-2 sm:col-span-1' name="character_type" label={dict.character.characterType} classNameLabel='text-text' classNameSelect='h-12' options={[{ key: "Player", value: dict.general.player }, { key: "NPC", value: "NPC" }, { key: "Enemy", value: dict.character.enemy }, { key: "Pet", value: dict.character.pet }]} defaultValue={character.character_type || ''} /> :
              <FormItemSelect className='col-span-2 sm:col-span-1' name="character_type" label={dict.character.characterType} classNameLabel='text-text' classNameSelect='h-12' options={[{ key: "Player", value: dict.general.player }, { key: "Pet", value: dict.character.pet }]} defaultValue={character.character_type || ''} />}
            <FormItemSelect className='col-span-2 sm:col-span-1' name="cclass" label={dict.character.cclass} classNameLabel='text-text' classNameSelect='h-12' defaultValue={character.cclass} options={getClasses('en')} />
            <FormItemInput className='col-span-4 sm:col-span-2' name="species" label={dict.character.species} placeholder={dict.character.human} defaultValue={character.species || ''} />
            <div className='col-span-4 sm:col-span-2 grid grid-cols-2 items-center gap-4'>
              <FormItemInput className='col-span-2' name="level" label={dict.character.level} type="number" defaultValue={character.level.toString()} />
              <FormItemInput className='col-span-2' name="max_hit_points" label={dict.character.maxHitPoints} type="number" max={9999} defaultValue={character.max_hit_points.toString()} />
              <FormItemInput className='col-span-2' name="armor_class" label={dict.character.armorClass} type="number" max={50} defaultValue={character.armor_class.toString()} />
            </div>
            <div className='col-span-4 sm:col-span-2 grid grid-cols-2 items-center gap-4'>
              <FormItemInput className='col-span-1' name="strength" label={dict.character.strength} type="number" defaultValue={character.strength.toString()} />
              <FormItemInput className='col-span-1' name="dexterity" label={dict.character.dexterity} type="number" defaultValue={character.dexterity.toString()} />
              <FormItemInput className='col-span-1' name="constitution" label={dict.character.constitution} type="number" defaultValue={character.constitution.toString()} />
              <FormItemInput className='col-span-1' name="intelligence" label={dict.character.intelligence} type="number" defaultValue={character.intelligence.toString()} />
              <FormItemInput className='col-span-1' name="wisdom" label={dict.character.wisdom} type="number" defaultValue={character.wisdom.toString()} />
              <FormItemInput className='col-span-1' name="charisma" label={dict.character.charisma} type="number" defaultValue={character.charisma.toString()} />
            </div>
          </div>
        </div>
        <Button type="submit" className="w-auto">{dict.character.update}</Button>
      </Form>
    </main>
  );
}