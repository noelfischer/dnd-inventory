import Link from "next/link";
import { fetchCampaigns, getUsernameFromSession } from "../lib/data";
import { Campaign } from "../lib/definitions";
import { getUIDFromSession } from "../lib/data";
import Button from "@/components/Button"
import { ArrowRight, Dices, LogOut, Milestone, PencilLine, Trash2 } from "lucide-react";
import { logOut } from "../lib/actions";


export default async function Page() {
  const uID = await getUIDFromSession();
  const username = await getUsernameFromSession();
  const campaigns = await fetchCampaigns(uID);
  return (
    <main>
      <div className="flex gap-2 text-zinc-700 dark:text-zinc-300">
        <Milestone />
        <p className="mb-6 font-semibold ">Logged in as {username}</p>
      </div>
      <h1 className="text-text text-2xl mb-12 bg-main p-3 border-y-4 border-black" style={{ marginInline: "-28px", paddingInline: "28px" }}>
        Campaigns</h1>
      <ul className="pb-3">
        {campaigns.map((campaign: Campaign) => {
          return (
            <li key={campaign.campaign_id} className="mb-5">
              <div className="flex gap-2 items-center rounded-lg border-2 border-black py-2 px-3 justify-between bg-bg dark:bg-darkBg">

                <Link className="unset w-full text-lg" href={`/campaigns/${campaign.campaign_id}`}>
                    {campaign.name}
                    <ArrowRight className="w-6 mx-3" />
                </Link>
                {campaign.dm_id === uID &&
                  <div className="flex gap-2">

                    <Link className="unset" href={`/campaigns/${campaign.campaign_id}/update`}>
                      <Button>
                        <span className="sr-only">Update</span>
                        <PencilLine className="w-5" />
                      </Button>
                    </Link>
                    <Link className="unset" href={`/campaigns/${campaign.campaign_id}/delete`} >
                      <Button>
                        <span className="sr-only">Delete</span>
                        <Trash2 className="w-5" />
                      </Button>
                    </Link>

                  </div>
                }
              </div>
            </li>
          )
        })}
      </ul>
      <div className="flex gap-3 items-center flex-wrap">
        <Link className="unset w-full sm:w-80" href={"/campaigns/create"}>
          <Button>
            Create a new Campaign
            <Dices className="w-6 h-6 ml-3" />
          </Button>
        </Link>
        <form action={logOut}>
          <Button className="w-full sm:w-48" type="submit">
            Logout
            <LogOut className="w-6 h-6 ml-3" />
          </Button>
        </form>
      </div>
    </main>
  );
}