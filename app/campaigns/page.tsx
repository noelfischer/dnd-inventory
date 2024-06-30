import Link from "next/link";
import { fetchCampaigns } from "../lib/data";
import { Campaign } from "../lib/definitions";
import { PlusIcon } from "@heroicons/react/24/outline";
import { LinkButton } from "../ui/campaigns/LinkButton";

export default async function Page() {
  //TODO replace user with actual user ID
  const uID = "1DFWeGwWse";

  const campaigns = await fetchCampaigns(uID);
  console.log(campaigns);
  return (
    <main>
      <h1>Campaigns</h1>
      <ul>
        {campaigns.map((campaign: Campaign) => (
          <li key={campaign.campaign_id}>
            <Link href={`/campaigns/${campaign.campaign_id}`}>
              {campaign.name}</Link>
              <LinkButton href={`/campaigns/${campaign.campaign_id}/update`}>Update</LinkButton>
              <LinkButton href={`/campaigns/${campaign.campaign_id}/delete`}>Delete</LinkButton>
          </li>
        ))}
      </ul>
      <LinkButton href={"/campaigns/create"} icon={ <PlusIcon className="w-5 md:w-6" />}>Create a new Campaign</LinkButton>
    </main>
  );
}