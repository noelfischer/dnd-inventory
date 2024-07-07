import Link from "next/link";
import { fetchCampaigns } from "../lib/data";
import { Campaign } from "../lib/definitions";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getUIDFromSession } from "../lib/data";
import { Button } from "@/components/ui/button"
import { BadgePlus } from "lucide-react";


export default async function Page() {
  const uID = await getUIDFromSession();
  const campaigns = await fetchCampaigns(uID);
  return (
    <main>
      <h1 className="text-2xl mb-6">Campaigns</h1>
      <ul className="pb-3">
        {campaigns.map((campaign: Campaign) => {
          return (
            <li key={campaign.campaign_id} className="mb-5">
              <div className="flex gap-2 items-center rounded-lg border py-2 px-3 justify-between">
              <Button variant="link" className="text-lg" asChild>
                <Link href={`/campaigns/${campaign.campaign_id}`}>
                  {campaign.name}
                </Link>
                </Button>
                {campaign.dm_id === uID &&
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/campaigns/${campaign.campaign_id}/update`}>
                        <span className="sr-only">Update</span>
                        <PencilIcon className="w-5" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/campaigns/${campaign.campaign_id}/delete`} >
                        <span className="sr-only">Delete</span>
                        <TrashIcon className="w-5" />
                      </Link>
                    </Button>
                  </div>
                }
              </div>
            </li>
          )
        })}
      </ul>
      <Button asChild>
        <Link href={"/campaigns/create"} className="w-full sm:w-min">
          Create a new Campaign
          <BadgePlus className="w-5 h-5 ml-3" />
        </Link>
      </Button>
    </main>
  );
}