import Link from "next/link";
import { fetchCampaign, fetchCharactersByCampaign, fetchCharactersByCampaignAndUser } from "../../lib/data";
import { Campaign, SimpleCharacter } from "../../lib/definitions";
import { notFound } from "next/navigation";
import { duplicateCharacter, getUIDFromSession } from "@/app/lib/actions";
import { PlusIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { LinkButton } from "@/app/ui/campaigns/LinkButton";
import InviteLink from "@/app/ui/campaigns/InviteLink";
import { ChevronRight, ShieldCheck, Trash2, Pencil, BookCopy } from "lucide-react";
import { Button } from "@/components/ui/button"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default async function Page({ params }: { params: { id: string } }) {
  const uID = await getUIDFromSession();
  const campaignID = params.id;
  const campaign: Campaign = await fetchCampaign(campaignID);
  if (!campaign) {
    notFound();
  }
  var characters;
  const isDM = campaign.dm_id === uID;
  if (isDM) {
    characters = await fetchCharactersByCampaign(campaignID);
  } else {
    characters = await fetchCharactersByCampaignAndUser(campaignID, uID);
  }

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/campaigns">Campaigns</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{campaign.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="pb-3"><span className="text-2xl">Description</span></div>
      <p className="text-gray-600">{campaign.description || "descriptionless campaign"}</p>
      <h2 className="text-2xl mt-7 mb-3">Players</h2>
      <div className="w-full flex flex-wrap gap-5">
        {characters.filter(character => character.character_type.toLowerCase() === "player").map((character: SimpleCharacter) =>
          <CharacterCard character={character} campaign={campaign} uID={uID} />
        )}
      </div>
      {isDM &&
        <>
          {characters.filter(character => character.character_type.toLowerCase() === "npc").length > 0 &&
            <>
              <h2 className="text-2xl mt-7 mb-3">NPCs</h2>
              <div className="w-full flex flex-wrap gap-5">
                {characters.filter(character => character.character_type.toLowerCase() === "npc").map((character: SimpleCharacter) =>
                  <CharacterCard character={character} campaign={campaign} uID={uID} />
                )}
              </div>
            </>
          }
          {characters.filter(character => character.character_type.toLowerCase() === "ally").length > 0 &&
            <>
              <h2 className="text-2xl mt-7 mb-3">Enemies</h2>
              <div className="w-full flex flex-wrap gap-5">
                {characters.filter(character => character.character_type.toLowerCase() === "enemy").map((character: SimpleCharacter) =>
                  <CharacterCard character={character} campaign={campaign} uID={uID} />
                )}
              </div>
            </>
          }
        </>
      }
      <h2 className="text-2xl mt-7 mb-3">Actions</h2>
      <div className="flex gap-2 items-center justify-start">
        <LinkButton href={`/campaigns/${campaign.campaign_id}/create-character`} icon={<PlusIcon className="w-5 md:w-6" />}>Create a new Character</LinkButton>
        {isDM &&
          <>
            <LinkButton href={`/campaigns/${campaign.campaign_id}/update`} icon={<Pencil className="w-5 md:w-6" />}>Update Campaign</LinkButton>
            <LinkButton href={`/campaigns/${campaign.campaign_id}/access`} icon={<ShieldCheckIcon className="w-5 md:w-6" />}>Handle Access</LinkButton>
          </>
        }
      </div>
      {isDM && <InviteLink link={`/join${campaign.password ? `/${campaign.password}` : "/-"}`} />}
    </main>
  );
}


const CharacterCard = ({ character, campaign, uID }: { character: SimpleCharacter, campaign: Campaign, uID: string }) => {
  const duplicateCharacterById = duplicateCharacter.bind(null, character.character_id, campaign.campaign_id);
  return (
    <Card key={character.character_id} className="w-full sm:max-w-[270px]">
      <CardHeader>
        <CardTitle>
          {character.name}
          <CardDescription className="mt-1">HP {character.current_hit_points} / {character.max_hit_points}</CardDescription>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button className="w-full" asChild>
          <Link href={`/dashboard/${character.character_id}`}>
            View Dashboard
            <ChevronRight className="h-5 w-5 ml-1 sm:ml-14" />
          </Link>
        </Button>
      </CardContent>
      <CardFooter className="w-full">
        {(campaign.dm_id === uID || character.user_id == uID) &&
          <div className="w-full flex gap-2 justify-between">
            <form action={duplicateCharacterById}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="w-14" type="submit">
                      <span className="sr-only">Duplicate</span>
                      <BookCopy className="w-5 h5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Duplicate {character.character_type}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </form>

            <Button variant="outline" size="icon" className="w-14" asChild>
              <Link href={`/campaigns/${campaign.campaign_id}/${character.character_id}/update`} >
                <span className="sr-only">Update</span>
                <Pencil className="w-5 h5" />
              </Link>
            </Button>


            <Button variant="outline" size="icon" className="w-14" asChild>
              <Link href={`/campaigns/${campaign.campaign_id}/${character.character_id}/delete`}>
                <span className="sr-only">Delete</span>
                <Trash2 className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        }
      </CardFooter>
    </Card>
  )

}