import { createCharacter } from '@/app/lib/actions';
import { fetchCampaign, getUIDFromSession } from '@/app/lib/data';
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

export default async function Page({ params }: { params: { id: string } }) {
  const campaignID = params.id;
  const campaign = await fetchCampaign(campaignID);
  const user_id = await getUIDFromSession();

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
      <Form action={createCharacterByCampaignID}>
        <h1 className="text-text text-2xl mb-3">Create Character</h1>
        <FormItemInput name="name" label="Choose a character name" minLength={2} />
        <FormItemTextArea name="description" label="Choose a character description" />
        <FormItemInput name="portrait_url" label="Enter a portrait URL" type="url" Icon={Link} />
        <FormItemSelect name="character_type" label="Select character type" options={[{ key: "Player", value: "Player" }, { key: "NPC", value: "NPC" }, { key: "Enemy", value: "Enemy" }]} defaultValue='Player' visible={isDM} />
        <FormItemInput name="race" label="Choose your race" minLength={2} />
        <FormItemInput name="cclass" label="Choose your class" placeholder='class' />
        <FormItemInput name="level" label="Choose your level" type="number" defaultValue='1' />
        <FormItemInput name="background" label="Choose your background" />
        <FormItemInput name="alignment" label="Choose your alignment" />
        <FormItemInput name="strength" label="Enter your strength" type="number" />
        <FormItemInput name="dexterity" label="Enter your dexterity" type="number" />
        <FormItemInput name="constitution" label="Enter your constitution" type="number" />
        <FormItemInput name="intelligence" label="Enter your intelligence" type="number" />
        <FormItemInput name="wisdom" label="Enter your wisdom" type="number" />
        <FormItemInput name="charisma" label="Enter your charisma" type="number" />
        <FormItemInput name="max_hit_points" label="Enter your max hit points" type="number" max={9999} />
        <FormItemInput name="armor_class" label="Enter your armor class" type="number" max={50} />
        <FormItemInput name="speed" label="Enter your speed" type="number" max={9999} />
        <Button type="submit" className="w-auto">Create Character</Button>
      </Form>
    </main>
  );
}