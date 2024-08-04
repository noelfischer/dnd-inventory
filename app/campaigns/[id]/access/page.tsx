import { deleteCampaignUser } from "@/app/lib/actions";
import { fetchCampaign, fetchCampaignUsers, getUIDFromSession } from "@/app/lib/data";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Button from "@/components/Button";
import { Trash2 } from "lucide-react";

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
            <h1 className="text-2xl mb-8 bg-main border-y-4 border-black"
                style={{ marginInline: "-28px", paddingInline: "28px", paddingBlock: "10px" }}
            >Campaign Users</h1>
            <ul>
                {campaignUsers.sort((u1, u2) => {
                    if (u1.user_id === uID) return -1;
                    if (u2.user_id === uID) return 1;
                    return u1.username.localeCompare(u2.username);
                }).map((user) => {
                    const deleteUserById = deleteCampaignUser.bind(null, user.campaign_user_id)
                    return (
                        <li key={user.user_id}>
                            <div className="flex gap-2 items-center rounded-lg py-2 px-3 justify-between h-16 mb-3 bg-bg dark:bg-darkBg border-2 border-black shadow-light dark:shadow-dark">
                                {user.username} {uID === user.user_id && '(You)'}
                                {uID !== user.user_id &&
                                    <form action={deleteUserById}>
                                        <Button type="submit">
                                            <span className="sr-only">Delete</span>
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
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