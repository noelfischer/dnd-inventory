import { deleteCampaignUser, getUIDFromSession } from "@/app/lib/actions";
import { fetchCampaign, fetchCampaignUsers } from "@/app/lib/data";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"

export default async function Page({ params }: { params: { id: string } }) {
    const uID = await getUIDFromSession();
    const campaignID = params.id;
    const campaign = await fetchCampaign(campaignID);
    const campaignUsers = await fetchCampaignUsers(campaignID);

    if (uID !== campaign.dm_id) {
        return <div>You are not the DM of this campaign.</div>;
    }

    return (
        <main>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem><BreadcrumbLink href="/campaigns">Campaigns</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbLink href={`/campaigns/${campaignID}`}>{campaign.name}</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbPage>Access</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl">Campaign Users</h1>
            <ul>
                {campaignUsers.map((user) => {
                    const deleteUserById = deleteCampaignUser.bind(null, user.campaign_user_id)
                    return (
                        <li key={user.user_id}>
                            <div className="flex gap-2 items-center rounded-lg border py-2 px-3 justify-between">
                                {user.username} {uID === user.user_id && '(You)'}
                                {uID !== user.user_id &&
                                    <form action={deleteUserById}>
                                        <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
                                            <span className="sr-only">Delete</span>
                                            <TrashIcon className="w-5" />
                                        </button>
                                    </form>
                                }
                            </div>
                        </li>
                    );
                })}
            </ul>
        </main>
    );
}