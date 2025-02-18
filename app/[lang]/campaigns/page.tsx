import Link from "next/link";
import { fetchCampaigns, fetchUsernameFromSession } from "../../../lib/data";
import { fetchUID } from "../../../lib/data";
import Button, { LinkButton } from "@/components/Button"
import { ArrowRight, Dices, LogOut, Milestone, PencilLine, Trash2 } from "lucide-react";
import { logOut } from "../../../lib/actions";
import { Campaign } from "@prisma/client";
import Tour from "./Tour";
import { getDictFromParams, Locale } from "../dictionaries";


export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const dict = await getDictFromParams(params)

  const uID = await fetchUID();
  const username: string = await fetchUsernameFromSession();
  const campaigns = await fetchCampaigns(uID);
  return (
    <main>
      {campaigns.length === 0 &&
        <Tour name={username} dict={dict} />
      }
      <div className="flex gap-2 text-zinc-700 dark:text-zinc-300">
        {(username && username.length > 0) &&
          <>
            <Milestone />
            <p className="mb-6 font-semibold username">{dict.campaigns.loggedInAs + " " + username}</p>
          </>
        }
      </div>
      <h1 className="text-text text-2xl mb-12 bg-banner banner">{dict.general.campaigns}</h1>
      <ul className="pb-3">
        {campaigns.map((campaign: Campaign) => {
          return (
            <li key={campaign.campaign_id} className="mb-5">
              <div className="flex gap-2 items-center rounded-lg border-2 border-black py-2 px-3 justify-between bg-bg dark:bg-dark-elevated-bg">

                <Link className="unset w-full text-lg" href={`/campaigns/${campaign.campaign_id}`}>
                  {campaign.name}
                  <ArrowRight className="w-6 mx-3" />
                </Link>
                {campaign.dm_id === uID &&
                  <div className="flex gap-2">

                    <Link className="unset" href={`/campaigns/${campaign.campaign_id}/update`}>
                      <LinkButton>
                        <span className="sr-only">{dict.general.update}</span>
                        <PencilLine className="w-5" />
                      </LinkButton>
                    </Link>
                    <Link className="unset" href={`/campaigns/${campaign.campaign_id}/delete`} >
                      <LinkButton>
                        <span className="sr-only">{dict.general.delete}</span>
                        <Trash2 className="w-5" />
                      </LinkButton>
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
          <Button className="new-campaign">
            {dict.campaigns.create}
            <Dices className="w-6 h-6 ml-3" />
          </Button>
        </Link>
        <form action={logOut}>
          <Button className="w-full sm:w-48" type="submit">
            {dict.general.logout}
            <LogOut className="w-6 h-6 ml-3" />
          </Button>
        </form>
      </div>
    </main>
  );
}