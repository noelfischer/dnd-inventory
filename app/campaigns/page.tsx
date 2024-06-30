import Link from "next/link";
import { fetchCampaigns } from "../lib/data";
import { Campaign } from "../lib/definitions";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { LinkButton } from "../ui/campaigns/LinkButton";
import { getEmailFromSession, getUIDFromSession } from "../lib/actions";
import Breadcrumbs from "../ui/invoices/breadcrumbs";


export default async function Page() {
  const uID = await getUIDFromSession();
  const campaigns = await fetchCampaigns(uID);
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Campaigns', href: '/campaigns', active: true, },
        ]}
      />
      <ul className="pb-7">
        {campaigns.map((campaign: Campaign) => {
          return (
            <li key={campaign.campaign_id}>
              <div className="flex gap-2 items-center">
                <Link href={`/campaigns/${campaign.campaign_id}`} className="pb-1 text-blue-600 font-medium text-lg">
                  {campaign.name}
                </Link>
                {campaign.dm_id === uID &&
                  <>
                    <Link href={`/campaigns/${campaign.campaign_id}/update`} className="rounded-md border p-2 hover:bg-gray-100">
                      <span className="sr-only">Update</span>
                      <PencilIcon className="w-5" />
                    </Link>

                    <Link href={`/campaigns/${campaign.campaign_id}/delete`} className="rounded-md border p-2 hover:bg-gray-100">
                      <span className="sr-only">Delete</span>
                      <TrashIcon className="w-5" />
                    </Link>
                  </>
                }
              </div>
            </li>
          )
        })}
      </ul>
      <LinkButton href={"/campaigns/create"} icon={<PlusIcon className="w-5 md:w-6" />}>Create a new Campaign</LinkButton>
    </main>
  );
}