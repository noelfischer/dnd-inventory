import { createCharacter } from '@/app/lib/actions';
import { fetchCampaign, getUIDFromSession } from '@/app/lib/data';
import { Button } from '@/app/ui/button';
import {
  BookOpenIcon, PlusCircleIcon
} from '@heroicons/react/24/outline';

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
      <form action={createCharacterByCampaignID}>
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
                  placeholder="Enter character name"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  required
                />
                <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
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
                  placeholder="Enter a description"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <BookOpenIcon className="pointer-events-none absolute left-3 top-1/4 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {/* Character type */}
            <div className={"mb-4" + (user_id === campaign.dm_id ? "" : "invisible max-h-0")}>
              <label htmlFor="character_type" className="mb-2 block text-sm font-medium">
                Choose a character type
              </label>
              <div className="relative mt-2 rounded-md">
                <select
                  id="character_type"
                  name="character_type"
                  defaultValue="Player"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 pr-10 text-sm outline-2 placeholder:text-gray-500"
                >
                  <option value="Player">Player</option>
                  <option value="Npc">NPC</option>
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
                <div className="relative">
                  <input
                    id="race"
                    name="race"
                    maxLength={100}
                    type="text"
                    placeholder="Enter race"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                  />
                  <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>

            {/* Class */}
            <div className="mb-4">
              <label htmlFor="cclass" className="mb-2 block text-sm font-medium">
                Choose a class
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="cclass"
                    name="cclass"
                    maxLength={100}
                    type="text"
                    placeholder="Enter class"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                  />
                  <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>

            {/* Level */}
            <div className="mb-4">
              <label htmlFor="level" className="mb-2 block text-sm font-medium">
                Choose a level
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="level"
                    name="level"
                    type="number"
                    placeholder="Enter level"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                  />
                  <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>

            {/* Background */}
            <div className="mb-4">
              <label htmlFor="background" className="mb-2 block text-sm font-medium">
                Choose a background
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="background"
                    name="background"
                    maxLength={100}
                    type="text"
                    placeholder="Enter background"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                  />
                  <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>

            {/* Alignment */}
            <div className="mb-4">
              <label htmlFor="alignment" className="mb-2 block text-sm font-medium">
                Choose an alignment
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="alignment"
                    name="alignment"
                    maxLength={100}
                    type="text"
                    placeholder="Enter alignment"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                  />
                  <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>

            {/* Portrait URL */}
            <div className="mb-4">
              <label htmlFor="portrait_url" className="mb-2 block text-sm font-medium">
                Enter a portrait URL
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="portrait_url"
                    name="portrait_url"
                    maxLength={300}
                    type="url"
                    placeholder="Enter a URL"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  />
                  <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/4 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>

            {/* Strength */}
            <div className="mb-4">
              <label htmlFor="strength" className="mb-2 block text-sm font-medium">
                Enter strength
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="strength"
                    name="strength"
                    type="number"
                    placeholder="Enter strength"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                  />
                  <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>

            {/* Dexterity */}
            <div className="mb-4">
              <label htmlFor="dexterity" className="mb-2 block text-sm font-medium">
                Enter dexterity
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="dexterity"
                    name="dexterity"
                    type="number"
                    placeholder="Enter dexterity"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                  />
                  <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>

            {/* Constitution */}
            <div className="mb-4">
              <label htmlFor="constitution" className="mb-2 block text-sm font-medium">
                Enter constitution
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="constitution"
                    name="constitution"
                    type="number"
                    placeholder="Enter constitution"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                  />
                  <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>

            {/* Intelligence */}
            <div className="mb-4">
              <label htmlFor="intelligence" className="mb-2 block text-sm font-medium">
                Enter intelligence
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="intelligence"
                    name="intelligence"
                    type="number"
                    placeholder="Enter intelligence"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                  />
                  <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>

            {/* Wisdom */}
            <div className="mb-4">
              <label htmlFor="wisdom" className="mb-2 block text-sm font-medium">
                Enter wisdom
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="wisdom"
                    name="wisdom"
                    type="number"
                    placeholder="Enter wisdom"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                  />
                  <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>

            {/* Charisma */}
            <div className="mb-4">
              <label htmlFor="charisma" className="mb-2 block text-sm font-medium">
                Enter charisma
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="charisma"
                    name="charisma"
                    type="number"
                    placeholder="Enter charisma"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                  />
                  <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>

            {/* Max Hit Points */}
            <div className="mb-4">
              <label htmlFor="max_hit_points" className="mb-2 block text-sm font-medium">
                Enter max hit points
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="max_hit_points"
                    name="max_hit_points"
                    type="number"
                    placeholder="Enter max hit points"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                  />
                  <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>

            {/* Armor Class */}
            <div className="mb-4">
              <label htmlFor="armor_class" className="mb-2 block text-sm font-medium">
                Enter armor class
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="armor_class"
                    name="armor_class"
                    type="number"
                    placeholder="Enter armor class"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                  />
                  <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>

            {/* Speed */}
            <div className="mb-4">
              <label htmlFor="speed" className="mb-2 block text-sm font-medium">
                Enter speed
              </label>
              <div className="relative mt-2 rounded-md">
                <div className="relative">
                  <input
                    id="speed"
                    name="speed"
                    type="number"
                    placeholder="Enter speed"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                  />
                  <PlusCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>
          </div>
          <Button type="submit">Create Character</Button>
        </div>
      </form>
    </main>
  );
}