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
            <FormItemInput className={isDM ? 'col-span-2' : 'col-span-4'} name="name" label="Choose a character name" minLength={2} defaultValue={character.name} />
            <FormItemSelect className='col-span-2' name="user_id" label="Choose the character owner" defaultValue={character.user_id} classNameLabel='text-text'
              options={usersInCampaign.map(user => ({ key: user.user_id, value: user.User.username }))} visible={isDM} />
            <FormItemTextArea className='col-span-4' name="description" label="Choose a character description" defaultValue={character.description || ''} />
            <FormItemInput className='col-span-4' name="portrait_url" label="Enter a portrait URL" type="url" Icon={Link} defaultValue={character.portrait_url || ''} maxLength={255} />
            {isDM ?
              <FormItemSelect className='col-span-2' name="character_type" label="Select character type" classNameLabel='text-text' options={[{ key: "Player", value: "Player" }, { key: "NPC", value: "NPC" }, { key: "Enemy", value: "Enemy" }, { key: "Pet", value: "Pet" }]} defaultValue={character.character_type || ''} /> :
              <FormItemSelect className='col-span-2' name="character_type" label="Select character type" classNameLabel='text-text' options={[{ key: "Player", value: "Player" }, { key: "Pet", value: "Pet" }]} defaultValue={character.character_type || ''} />}
            <FormItemInput className='col-span-2' name="race" label='Choose your race' minLength={2} defaultValue={character.race || ''} />
            <FormItemSelect className='col-span-2' name="cclass" label="Choose your class" classNameLabel='text-text' defaultValue={character.cclass} options={getClasses('en')} />
            <FormItemInput className='col-span-2' name="level" label="Choose your level" type="number" defaultValue={character.level.toString()} />
            <FormItemInput className='col-span-2' name="background" label="Choose your background" defaultValue={character.background || ''} maxLength={100} />
            <FormItemInput className='col-span-2' name="alignment" label="Choose your alignment" defaultValue={character.alignment || ''} />
            <FormItemInput name="strength" label="Enter your strength (0-20)" type="number" defaultValue={character.strength.toString()} />
            <FormItemInput name="dexterity" label="Enter your dexterity" type="number" defaultValue={character.dexterity.toString()} />
            <FormItemInput name="constitution" label="Enter your constitution" type="number" defaultValue={character.constitution.toString()} />
            <FormItemInput name="intelligence" label="Enter your intelligence" type="number" defaultValue={character.intelligence.toString()} />
            <FormItemInput name="wisdom" label="Enter your wisdom" type="number" defaultValue={character.wisdom.toString()} />
            <FormItemInput name="charisma" label="Enter your charisma" type="number" defaultValue={character.charisma.toString()} />
            <FormItemInput name="max_hit_points" label="Enter your max hit points" type="number" max={9999} defaultValue={character.max_hit_points.toString()} />
            <FormItemInput name="armor_class" label="Enter your armor class" type="number" max={50} defaultValue={character.armor_class.toString()} />
          </div>
        </div>
        <Button type="submit" className="w-auto">Update Character</Button>
      </Form>
    </main>
  );
}