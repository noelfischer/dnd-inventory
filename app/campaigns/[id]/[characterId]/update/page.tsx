import { getUIDFromSession, updateCharacter } from '@/app/lib/actions';
import { fetchCampaign, fetchCharacter, fetchUsername, fetchUsersByCampaign } from '@/app/lib/data';
import { Campaign } from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import {
  BookOpenIcon, PlusCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';

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

  const updateCharacterWithId = updateCharacter.bind(null, characterID, campaignID);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Campaigns', href: '/campaigns' },
          {
            label: campaign.name,
            href: '/campaigns/' + campaignID,
          },
          {
            label: 'Update Character',
            href: '/campaigns/' + campaignID + '/' + characterID + '/update',
            active: true,
          },
        ]}
      />
      <form action={updateCharacterWithId}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Character name */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Choose a character name
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  maxLength={100}
                  type="text"
                  placeholder={character.name}
                  defaultValue={character.name}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
          {/* Character Owner (only viewable by DM) */}
          <div className={"mb-4 " + (user_id === campaign.dm_id ? "": "invisible max-h-0")} >
            <label htmlFor="user_id" className="mb-2 block text-sm font-medium">
              Choose the character owner
            </label>
            <div className="relative mt-2 rounded-md">
              <select
                id="user_id"
                name="user_id"
                defaultValue={character.user_id}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 pr-10 text-sm outline-2 placeholder:text-gray-500"
              >
                {usersInCampaign.map((user) => {
                  return (
                    <option key={user.user_id} value={user.user_id}>
                      {fetchUsername(user.user_id)}
                    </option>
                  );
                })}
              </select>
              <ShieldCheckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>

          {/* Character description */}
          <div className="mb-4">
            <label htmlFor="description" className="mb-2 block text-sm font-medium">
              Choose a character description
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  maxLength={300}
                  placeholder={character.description}
                  defaultValue={character.description}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <BookOpenIcon className="pointer-events-none absolute left-3 top-1/4 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Character type */}
          <div className={"mb-4"  + (user_id === campaign.dm_id ? "": "invisible max-h-0")}>
            <label htmlFor="character_type" className="mb-2 block text-sm font-medium">
              Choose a character type
            </label>
            <div className="relative mt-2 rounded-md">
              <select
                id="character_type"
                name="character_type"
                defaultValue={character.character_type}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 pr-10 text-sm outline-2 placeholder:text-gray-500"
              >
                <option value="Player">Player</option>
                <option value="NPC">NPC</option>
                <option value="Enemy">Enemy</option>
                {/* Add more character types as needed */}
              </select>
              <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>

          {/* Race */}
          <div className="mb-4">
            <label htmlFor="race" className="mb-2 block text-sm font-medium">
              Choose a race
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="race"
                name="race"
                maxLength={100}
                type="text"
                placeholder={character.race}
                defaultValue={character.race}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>

          {/* Class */}
          <div className="mb-4">
            <label htmlFor="cclass" className="mb-2 block text-sm font-medium">
              Choose a class
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="cclass"
                name="cclass"
                maxLength={100}
                type="text"
                placeholder={character.cclass}
                defaultValue={character.cclass}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>

          {/* Level */}
          <div className="mb-4">
            <label htmlFor="level" className="mb-2 block text-sm font-medium">
              Choose a level
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="level"
                name="level"
                type="number"
                min={1}
                max={20}
                placeholder={character.level.toString()}
                defaultValue={character.level.toString()}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>

          {/* Background */}
          <div className="mb-4">
            <label htmlFor="background" className="mb-2 block text-sm font-medium">
              Choose a background
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="background"
                name="background"
                maxLength={100}
                type="text"
                placeholder={character.background}
                defaultValue={character.background}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>

          {/* Alignment */}
          <div className="mb-4">
            <label htmlFor="alignment" className="mb-2 block text-sm font-medium">
              Choose an alignment
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="alignment"
                name="alignment"
                maxLength={100}
                type="text"
                placeholder={character.alignment}
                defaultValue={character.alignment}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>

          {/* Portrait URL */}
          <div className="mb-4">
            <label htmlFor="portrait_url" className="mb-2 block text-sm font-medium">
              Enter a portrait URL
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="portrait_url"
                name="portrait_url"
                maxLength={200}
                type="url"
                placeholder={character.portrait_url}
                defaultValue={character.portrait_url}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>

          {/* Strength */}
          <div className="mb-4">
            <label htmlFor="strength" className="mb-2 block text-sm font-medium">
              Enter strength value
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="strength"
                name="strength"
                type="number"
                min={1}
                max={20}
                placeholder={character.strength.toString()}
                defaultValue={character.strength.toString()}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>

          {/* Dexterity */}
          <div className="mb-4">
            <label htmlFor="dexterity" className="mb-2 block text-sm font-medium">
              Enter dexterity value
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="dexterity"
                name="dexterity"
                type="number"
                min={1}
                max={20}
                placeholder={character.dexterity.toString()}
                defaultValue={character.dexterity.toString()}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>

          {/* Constitution */}
          <div className="mb-4">
            <label htmlFor="constitution" className="mb-2 block text-sm font-medium">
              Enter constitution value
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="constitution"
                name="constitution"
                type="number"
                min={1}
                max={20}
                placeholder={character.constitution.toString()}
                defaultValue={character.constitution.toString()}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>

          {/* Intelligence */}
          <div className="mb-4">
            <label htmlFor="intelligence" className="mb-2 block text-sm font-medium">
              Enter intelligence value
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="intelligence"
                name="intelligence"
                type="number"
                min={1}
                max={20}
                placeholder={character.intelligence.toString()}
                defaultValue={character.intelligence.toString()}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>

          {/* Wisdom */}
          <div className="mb-4">
            <label htmlFor="wisdom" className="mb-2 block text-sm font-medium">
              Enter wisdom value
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="wisdom"
                name="wisdom"
                type="number"
                min={1}
                max={20}
                placeholder={character.wisdom.toString()}
                defaultValue={character.wisdom.toString()}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>

          {/* Charisma */}
          <div className="mb-4">
            <label htmlFor="charisma" className="mb-2 block text-sm font-medium">
              Enter charisma value
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="charisma"
                name="charisma"
                type="number"
                min={1}
                max={20}
                placeholder={character.charisma.toString()}
                defaultValue={character.charisma.toString()}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>

          {/* Max Hit Points */}
          <div className="mb-4">
            <label htmlFor="max_hit_points" className="mb-2 block text-sm font-medium">
              Enter max hit points
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="max_hit_points"
                name="max_hit_points"
                type="number"
                min={1}
                placeholder={character.max_hit_points.toString()}
                defaultValue={character.max_hit_points.toString()}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>

          {/* Armor Class */}
          <div className="mb-4">
            <label htmlFor="armor_class" className="mb-2 block text-sm font-medium">
              Enter armor class
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="armor_class"
                name="armor_class"
                type="number"
                min={1}
                placeholder={character.armor_class.toString()}
                defaultValue={character.armor_class.toString()}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>

          {/* Speed */}
          <div className="mb-4">
            <label htmlFor="speed" className="mb-2 block text-sm font-medium">
              Enter speed
            </label>
            <div className="relative mt-2 rounded-md">
              <input
                id="speed"
                name="speed"
                type="number"
                min={1}
                placeholder={character.speed.toString()}
                defaultValue={character.speed.toString()}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            </div>
          </div>

          <Button type="submit">Update Character</Button>
        </div>
      </form>
    </main>
  );
}