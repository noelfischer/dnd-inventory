import Link from "next/link";
import { fetchCampaign, fetchCharactersByCampaign, fetchCharactersByCampaignAndUser, fetchDashboardsByCampaign, getUIDFromSession } from "../../lib/data";
import { Campaign, Dashboard, SimpleCharacter } from "../../lib/definitions";
import { notFound } from "next/navigation";
import { duplicateCharacter } from "@/app/lib/actions";
import InviteLink from "@/app/ui/campaigns/InviteLink";
import { ChevronRight, ShieldCheck, Trash2, Pencil, BookCopy, DiamondPlus } from "lucide-react";
import Button from "@/components/Button"

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
  const dashboards: Dashboard[] = await fetchDashboardsByCampaign(campaignID);
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
      <div className="bg-banner banner">
        <h1 className=" text-text text-2xl font-semibold">{campaign.name}</h1>
        <p className="text-text">{campaign.description || "descriptionless campaign"}</p>
      </div>
      <h2 className="text-2xl mt-7 mb-3">Players</h2>
      <div className="w-full flex flex-wrap gap-5">
        {characters.filter(character => character.character_type.toLowerCase() === "player").map((character: SimpleCharacter) =>
          <CharacterCard character={character} campaign={campaign} uID={uID} key={character.character_id}
            dashboardID={dashboards.find(dashboard => dashboard.character_id === character.character_id)?.dashboard_id || ""} />
        )}
      </div>
      {isDM &&
        <>
          {characters.filter(character => character.character_type.toLowerCase() === "npc").length > 0 &&
            <>
              <h2 className="text-2xl mt-7 mb-3">NPCs</h2>
              <div className="w-full flex flex-wrap gap-5">
                {characters.filter(character => character.character_type.toLowerCase() === "npc").map((character: SimpleCharacter) =>
                  <CharacterCard character={character} campaign={campaign} uID={uID} key={character.character_id}
                    dashboardID={dashboards.find(dashboard => dashboard.character_id === character.character_id)?.dashboard_id || ""} />
                )}
              </div>
            </>
          }
          {characters.filter(character => character.character_type.toLowerCase() === "enemy").length > 0 &&
            <>
              <h2 className="text-2xl mt-7 mb-3">Enemies</h2>
              <div className="w-full flex flex-wrap gap-5">
                {characters.filter(character => character.character_type.toLowerCase() === "enemy").map((character: SimpleCharacter) =>
                  <CharacterCard character={character} campaign={campaign} uID={uID} key={character.character_id}
                    dashboardID={dashboards.find(dashboard => dashboard.character_id === character.character_id)?.dashboard_id || ""} />
                )}
              </div>
            </>
          }
        </>
      }
      <h2 className="text-2xl mt-10 pt-6 mb-3 border-t-2 border-neutral-500/20">Actions</h2>
      <div className="flex gap-2 items-center flex-wrap">
        <Link className="unset w-full sm:max-w-64" href={`/campaigns/${campaign.campaign_id}/create-character`}>
          <Button>
            Create a new Character
            <DiamondPlus className="w-6 mr-1" />
          </Button>
        </Link>
        {isDM &&
          <>
            <Link className="unset w-full sm:max-w-64" href={`/campaigns/${campaign.campaign_id}/update`}>
              <Button>
                Update Campaign
                <Pencil className="w-6 mr-1" />
              </Button>
            </Link>
            <Link className="unset w-full sm:max-w-64" href={`/campaigns/${campaign.campaign_id}/access`}>
              <Button>
                Handle Access
                <ShieldCheck className="w-6 mr-1" />
              </Button>
            </Link>
          </>
        }
      </div>
      {isDM && <InviteLink link={`/join${campaign.password ? `/${campaign.password}` : "/-"}`} />}
    </main>
  );
}


const CharacterCard = ({ character, campaign, uID, dashboardID }: { character: SimpleCharacter, campaign: Campaign, uID: string, dashboardID: string }) => {
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
        <Link className="unset" href={`/dashboard/${dashboardID}`}>
          <Button>
            View Dashboard
            <ChevronRight className="h-6 w-6 ml-1 sm:ml-3" />
          </Button>
        </Link>
      </CardContent>
      <CardFooter>
        {(campaign.dm_id === uID || character.user_id == uID) &&
          <div className="w-full flex gap-2 justify-between">
            <form action={duplicateCharacterById}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="submit">
                      <span className="sr-only">Duplicate</span>
                      <BookCopy className="w-5 h6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Duplicate {character.character_type}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </form>

            <span>
              <Link className="unset" href={`/campaigns/${campaign.campaign_id}/${character.character_id}/update`}>
                <Button>
                  <span className="sr-only">Update</span>
                  <Pencil className="w-5 h6" />
                </Button>
              </Link>
            </span>


            <span>
              <Link className="unset" href={`/campaigns/${campaign.campaign_id}/${character.character_id}/delete`}>
                <Button>
                  <span className="sr-only">Delete</span>
                  <Trash2 className="h-6 w-5" />
                </Button>
              </Link>
            </span>

          </div>
        }
      </CardFooter>
    </Card>
  )

}