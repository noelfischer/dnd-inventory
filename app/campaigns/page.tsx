import Link from "next/link";
import { fetchCampaigns } from "../lib/data";
import { Campaign } from "../lib/definitions";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getUIDFromSession } from "../lib/data";
import Button from "@/components/Button"
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
              <div className="flex gap-2 items-center rounded-lg border-2 border-black py-2 px-3 justify-between bg-main">
                <Button className="text-lg">
                  <Link className="unset" href={`/campaigns/${campaign.campaign_id}`}>
                    {campaign.name}
                  </Link>
                </Button>
                {campaign.dm_id === uID &&
                  <div className="flex gap-2">

                    <Link className="unset" href={`/campaigns/${campaign.campaign_id}/update`}>
                      <Button>
                        <span className="sr-only">Update</span>
                        <PencilIcon className="w-5" />
                      </Button>
                    </Link>
                    <Link className="unset" href={`/campaigns/${campaign.campaign_id}/delete`} >
                      <Button>
                        <span className="sr-only">Delete</span>
                        <TrashIcon className="w-5" />
                      </Button>
                    </Link>

                  </div>
                }
              </div>
            </li>
          )
        })}
      </ul>
      <Button className="w-full sm:w-64">
        <Link className="unset" href={"/campaigns/create"}>
          Create a new Campaign
          <BadgePlus className="w-5 h-5 ml-3" />
        </Link>
      </Button>
    </main>
  );
}