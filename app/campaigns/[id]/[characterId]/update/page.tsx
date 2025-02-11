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

export default async function Page(props: { params: Promise<{ id: string, characterId: string }> }) {
  const params = await props.params;
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
          <BreadcrumbItem><BreadcrumbLink href="/campaigns">Campaigns</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={`/campaigns/${campaignID}`}>{campaign.name}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Update {character.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Form action={updateCharacterWithId} close={"/campaigns/" + campaignID}>
        <h1 className="text-2xl text-text">Create Character</h1>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <FormItemInput className={isDM ? 'col-span-2' : 'col-span-4'} name="name" label="Character name" minLength={2} defaultValue={character.name} />
            <FormItemSelect className='col-span-2' name="user_id" label="Character owner" defaultValue={character.user_id} classNameLabel='text-text'
              options={usersInCampaign.map(user => ({ key: user.user_id, value: user.User.username }))} visible={isDM} />
            <FormItemTextArea className='col-span-4' classNameTextArea='h-28' name="description" label="Description" placeholder='Choose a character description' defaultValue={character.description || ''} />
            <FormItemInput className='col-span-4' name="portrait_url" label="Portrait URL" type="url" Icon={Link} defaultValue={character.portrait_url || ''} maxLength={255} />
            {isDM ?
              <FormItemSelect className='col-span-2 sm:col-span-1' name="character_type" label="Type" classNameLabel='text-text' classNameSelect='h-12' options={[{ key: "Player", value: "Player" }, { key: "NPC", value: "NPC" }, { key: "Enemy", value: "Enemy" }, { key: "Pet", value: "Pet" }]} defaultValue={character.character_type || ''} /> :
              <FormItemSelect className='col-span-2 sm:col-span-1' name="character_type" label="Type" classNameLabel='text-text' classNameSelect='h-12' options={[{ key: "Player", value: "Player" }, { key: "Pet", value: "Pet" }]} defaultValue={character.character_type || ''} />}
            <FormItemSelect className='col-span-2 sm:col-span-1' name="cclass" label="Class" classNameLabel='text-text' classNameSelect='h-12' defaultValue={character.cclass} options={getClasses('en')} />
            <FormItemInput className='col-span-4 sm:col-span-2' name="species" label="Species" placeholder='Human' minLength={2} defaultValue={character.species || ''} />
            <div className='col-span-4 sm:col-span-2 grid grid-cols-2 items-center gap-4'>
              <FormItemInput className='col-span-2' name="level" label="Choose your level" type="number" defaultValue={character.level.toString()} />
              <FormItemInput className='col-span-2' name="max_hit_points" label="Max hit points" type="number" max={9999} defaultValue={character.max_hit_points.toString()} />
              <FormItemInput className='col-span-2' name="armor_class" label="Armor class" type="number" max={50} defaultValue={character.armor_class.toString()} />
            </div>
            <div className='col-span-4 sm:col-span-2 grid grid-cols-2 items-center gap-4'>
              <FormItemInput className='col-span-1' name="strength" label="Strength (0-20)" type="number" defaultValue={character.strength.toString()} />
              <FormItemInput className='col-span-1' name="dexterity" label="Dexterity" type="number" defaultValue={character.dexterity.toString()} />
              <FormItemInput className='col-span-1' name="constitution" label="Constitution" type="number" defaultValue={character.constitution.toString()} />
              <FormItemInput className='col-span-1' name="intelligence" label="Intelligence" type="number" defaultValue={character.intelligence.toString()} />
              <FormItemInput className='col-span-1' name="wisdom" label="Wisdom" type="number" defaultValue={character.wisdom.toString()} />
              <FormItemInput className='col-span-1' name="charisma" label="Charisma" type="number" defaultValue={character.charisma.toString()} />
            </div>
          </div>
        </div>
        <Button type="submit" className="w-auto">Update Character</Button>
      </Form>
    </main>
  );
}