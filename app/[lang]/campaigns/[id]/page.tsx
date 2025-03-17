import Link from "next/link";
import { fetchCampaign, fetchCharactersByCampaign, fetchCharactersByCampaignAndUser, fetchDashboardsByCampaign, fetchUID } from "../../../../lib/data";
import { SimpleCharacter } from "../../../../lib/definitions";
import { notFound } from "next/navigation";
import { duplicateCharacter, exportCharacter } from "@/lib/actions";
import InviteLink from "@/app/ui/campaigns/InviteLink";
import { ChevronRight, ShieldCheck, Trash2, Pencil, SquarePlus, ArrowUpFromLine } from "lucide-react";
import { LinkButton } from "@/components/Button"
import DropdownCampaignCharacterOptions from "@/app/ui/campaigns/DropdownCampaignCharacterOptions";
import { Campaign, Dashboard } from "@prisma/client";

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
import Tour from "./Tour";
import { Dictionary, getDictionary, Locale } from "../../dictionaries";

export default async function Page(props: { params: Promise<{ id: string, lang: Locale }> }) {
  const params = await props.params;
  const uID = await fetchUID();
  const { id, lang } = await params;
  const dict = await getDictionary(lang);
  const campaignID = id;
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
      <Tour isDM={isDM} characterLength={characters.length} dict={dict} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/campaigns">{dict.general.campaigns}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{campaign.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="bg-banner banner">
        <h1 className=" text-text text-2xl font-semibold">{campaign.name}</h1>
        <p className="text-text">{campaign.description || dict.campaign.descriptionLessCampaign}</p>
      </div>
      <CharacterTypeGroup characters={characters} campaign={campaign} uID={uID} type="player" typeShown={dict.general.players} dashboards={dashboards} dict={dict} />
      {isDM && <>
        <CharacterTypeGroup characters={characters} campaign={campaign} uID={uID} type="npc" typeShown="NPCs" dashboards={dashboards} dict={dict} />
        <CharacterTypeGroup characters={characters} campaign={campaign} uID={uID} type="enemy" typeShown={dict.campaign.enemies} dashboards={dashboards} dict={dict} />
      </>}
      <CharacterTypeGroup characters={characters} campaign={campaign} uID={uID} type="pet" typeShown={dict.campaign.pets} dashboards={dashboards} dict={dict} />

      <h2 className="text-2xl mt-10 pt-6 mb-3 border-t-2 border-neutral-500/20"><span className="actions pr-6">{dict.general.actions}</span></h2>
      <div className="flex gap-2 items-center flex-wrap">
        <Link className="view-party-dashboard unset w-full sm:max-w-64" href={`/dashboard/${dashboards.filter
          (dashboard => dashboard.character_id === null)[0]?.dashboard_id || "-"
          }`}>
          <LinkButton disabled={characters.length == 0}>
            {dict.campaign.viewPartyDashboard}
            <ChevronRight className="w-6 mr-1" />
          </LinkButton>
        </Link>
        <Link className="new-character unset w-full sm:max-w-64" href={`/campaigns/${campaign.campaign_id}/create-character`}>
          <LinkButton>
            {dict.campaign.createCharacter}
            <SquarePlus className="w-6 mr-1" />
          </LinkButton>
        </Link>
        {isDM &&
          <>
            <Link className="update-campaign unset w-full sm:max-w-64" href={`/campaigns/${campaign.campaign_id}/update`}>
              <LinkButton>
                {dict.campaign.update}
                <Pencil className="w-6 mr-1" />
              </LinkButton>
            </Link>
            <Link className="handle-access unset w-full sm:max-w-64" href={`/campaigns/${campaign.campaign_id}/access`}>
              <LinkButton>
                {dict.campaign.access}
                <ShieldCheck className="w-6 mr-1" />
              </LinkButton>
            </Link>
          </>
        }
        <Link className="upload-character unset w-full sm:max-w-64" href={`/campaigns/${campaign.campaign_id}/upload`}>
          <LinkButton>
            {dict.campaign.upload}
            <ArrowUpFromLine className="w-6 mr-1" />
          </LinkButton>
        </Link>
      </div>
      {isDM && <InviteLink link={`/join${campaign.password ? `/${campaign.password}` : "/-"}`} dict={dict} />}
    </main>
  );
}

const CharacterTypeGroup = ({ characters, campaign, uID, dashboards, type, typeShown, dict }: { characters: SimpleCharacter[], campaign: Campaign, uID: string, dashboards: Dashboard[], type: string, typeShown: string, dict: Dictionary }) => {
  if (characters.filter(character => character.character_type.toLowerCase() === type).length === 0) return null;
  return (
    <>
      <h2 className="text-2xl mt-7 mb-3">{typeShown}</h2>
      <div className="w-full flex flex-wrap gap-5">
        {characters.filter(character => character.character_type.toLowerCase() === type).map((character: SimpleCharacter) =>
          <CharacterCard character={character} campaign={campaign} uID={uID} key={character.character_id} dict={dict}
            dashboardID={dashboards.find(dashboard => dashboard.character_id === character.character_id)?.dashboard_id || ""} />
        )}
      </div>
    </>
  )
}

const CharacterCard = ({ character, campaign, uID, dashboardID, dict }: { character: SimpleCharacter, campaign: Campaign, uID: string, dashboardID: string, dict: Dictionary }) => {
  const duplicateCharacterById = duplicateCharacter.bind(null, character.character_id, campaign.campaign_id, character.name);
  const exportCharacterById = exportCharacter.bind(null, character.character_id);
  console.log(dashboardID, character);
  return (
    <Card key={character.character_id} className="w-full sm:max-w-[270px] overflow-visible">
      <CardHeader>
        <CardTitle>
          <span className="character-title pr-5">{character.name}</span>
          <CardDescription className="mt-1">HP {character.current_hit_points} / {character.max_hit_points}</CardDescription>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Link className="view-character-dashboard unset" href={`/dashboard/${dashboardID}`}>
          <LinkButton>
            {dict.campaign.viewDashboard}
            <ChevronRight className="h-6 w-6 ml-1 sm:ml-3" />
          </LinkButton>
        </Link>
      </CardContent>
      <CardFooter>
        <div className="w-full flex gap-2 justify-between">
          <span>
            <Link className="update-character unset" href={`/campaigns/${campaign.campaign_id}/${character.character_id}/update`}>
              <LinkButton>
                <span className="sr-only">{dict.general.update}</span>
                <Pencil className="w-5 h6" />
              </LinkButton>
            </Link>
          </span>
          <span>
            <Link className="delete-character unset" href={`/campaigns/${campaign.campaign_id}/${character.character_id}/delete`}>
              <LinkButton>
                <span className="sr-only">{dict.general.delete}</span>
                <Trash2 className="h-6 w-5" />
              </LinkButton>
            </Link>
          </span>
          <DropdownCampaignCharacterOptions
            className="dropdown-character-options"
            duplicateCharacterById={duplicateCharacterById}
            exportCharacterById={exportCharacterById}
            character_id={character.character_id}
            campaign_id={campaign.campaign_id}
            dict={dict} />
        </div>
      </CardFooter>
    </Card>
  )

}