import Link from "next/link";
import { fetchCampaign, fetchCharactersByCampaign, fetchCharactersByCampaignAndUser } from "../../lib/data";
import { Campaign, SimpleCharacter } from "../../lib/definitions";
import { notFound } from "next/navigation";
import { duplicateCharacter, getUIDFromSession } from "@/app/lib/actions";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { PencilIcon, PlusIcon, TrashIcon, ShieldCheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { LinkButton } from "@/app/ui/campaigns/LinkButton";
import InviteLink from "@/app/ui/campaigns/InviteLink";

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
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Campaigns', href: '/campaigns' },
          {
            label: campaign.name,
            href: '/campaigns/' + campaignID,
            active: true,
          },
        ]}
      />
      <div className="pb-3"><span className="text-2xl">Description</span></div>
      <p className="text-gray-600">{campaign.description || "descriptionless campaign"}</p>
      <h2 className="text-2xl mt-7 mb-3">Characters</h2>
      <ul className="pb-5">
        {characters.map((character: SimpleCharacter) => {
          const duplicateCharacterById = duplicateCharacter.bind(null, character.character_id, campaignID);
          return (
            <li key={campaign.campaign_id}>
              <div className="flex gap-2 items-center rounded-lg border py-2 px-3 justify-between">
                <Link href={`/dashboard/${character.character_id}`} className="pb-1 text-blue-600 font-medium text-lg">
                  {character.name + ", " + character.character_type}
                </Link>
                {(campaign.dm_id === uID || character.user_id == uID) &&
                  <div className="flex gap-2">
                    <form action={duplicateCharacterById}>
                      <button data-tooltip-target="tooltip-default" type="submit" className="rounded-md border p-2 hover:bg-gray-100">
                        <span className="sr-only">Duplicate</span>
                        <DocumentDuplicateIcon className="w-5" />
                      </button>
                    </form>
                    
                    <Link href={`/campaigns/${campaign.campaign_id}/${character.character_id}/update`} className="rounded-md border p-2 hover:bg-gray-100">
                      <span className="sr-only">Update</span>
                      <PencilIcon className="w-5" />
                    </Link>

                    <Link href={`/campaigns/${campaign.campaign_id}/${character.character_id}/delete`} className="rounded-md border p-2 hover:bg-gray-100">
                      <span className="sr-only">Delete</span>
                      <TrashIcon className="w-5" />
                    </Link>
                  </div>
                }
              </div>
            </li>
          )
        })}
      </ul>
      <div className="flex gap-2 items-center justify-start">
        <LinkButton href={`/campaigns/${campaign.campaign_id}/create-character`} icon={<PlusIcon className="w-5 md:w-6" />}>Create a new Character</LinkButton>
        {isDM &&
          <>
            <LinkButton href={`/campaigns/${campaign.campaign_id}/update`} icon={<PencilIcon className="w-5 md:w-6" />}>Update Campaign</LinkButton>
            <LinkButton href={`/campaigns/${campaign.campaign_id}/access`} icon={<ShieldCheckIcon className="w-5 md:w-6" />}>Handle Access</LinkButton>
          </>
        }
      </div>
      {isDM && <InviteLink link={`/join${campaign.password ? `/${campaign.password}` : "/-"}`} />}
    </main>
  );
}