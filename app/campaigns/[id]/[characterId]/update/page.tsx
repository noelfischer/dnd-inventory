import { updateCharacter } from '@/app/lib/actions';
import { fetchCampaign, fetchCharacter, fetchUsername, fetchUsersByCampaign, getUIDFromSession } from '@/app/lib/data';
import { Campaign } from '@/app/lib/definitions';
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

export default async function Page({ params }: { params: { id: string, characterId: string } }) {
  const campaignID = params.id;
  const characterID = params.characterId;
  const user_id = await getUIDFromSession();

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

      <Form action={updateCharacterWithId}>
        <h1 className="text-2xl">Create Character</h1>
        <FormItemInput name="name" label="Choose a character name" minLength={2} defaultValue={character.name} />
        <FormItemSelect name="user_id" label="Choose the character owner" defaultValue={character.user_id}
          options={usersInCampaign.map(user => ({ key: user.user_id, value: user.username }))} visible={isDM} />
        <FormItemTextArea name="description" label="Choose a character description" defaultValue={character.description} />
        <FormItemInput name="portrait_url" label="Enter a portrait URL" type="url" Icon={Link} defaultValue={character.portrait_url} />
        <FormItemSelect name="character_type" label="Select character type" options={[{ key: "Player", value: "Player" }, { key: "NPC", value: "NPC" }, { key: "Enemy", value: "Enemy" }]} defaultValue={character.character_type} visible={isDM} />
        <FormItemInput name="race" label='Choose your race' minLength={2} defaultValue={character.race} />
        <FormItemInput name="cclass" label="Choose your class" placeholder='class' defaultValue={character.cclass} />
        <FormItemInput name="level" label="Choose your level" type="number" defaultValue={character.level.toString()} />
        <FormItemInput name="background" label="Choose your background" defaultValue={character.background} />
        <FormItemInput name="alignment" label="Choose your alignment" defaultValue={character.alignment} />
        <FormItemInput name="strength" label="Enter your strength" type="number" defaultValue={character.strength.toString()} />
        <FormItemInput name="dexterity" label="Enter your dexterity" type="number" defaultValue={character.dexterity.toString()} />
        <FormItemInput name="constitution" label="Enter your constitution" type="number" defaultValue={character.constitution.toString()} />
        <FormItemInput name="intelligence" label="Enter your intelligence" type="number" defaultValue={character.intelligence.toString()} />
        <FormItemInput name="wisdom" label="Enter your wisdom" type="number" defaultValue={character.wisdom.toString()} />
        <FormItemInput name="charisma" label="Enter your charisma" type="number" defaultValue={character.charisma.toString()} />
        <FormItemInput name="max_hit_points" label="Enter your max hit points" type="number" max={9999} defaultValue={character.max_hit_points.toString()} />
        <FormItemInput name="armor_class" label="Enter your armor class" type="number" max={50} defaultValue={character.armor_class.toString()} />
        <FormItemInput name="speed" label="Enter your speed" type="number" max={9999} defaultValue={character.speed.toString()} />
        <Button type="submit" className="w-auto">Update Character</Button>
      </Form>
    </main>
  );
}