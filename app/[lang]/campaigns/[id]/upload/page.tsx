import { fetchCampaign } from "@/lib/data";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import UploadCharacter from "./UploadCharacter";
import { importCharacter } from "@/lib/actions";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const campaignID = params.id;
    const campaign = await fetchCampaign(campaignID);

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
            <h1 className="text-text text-2xl mb-8 bg-banner banner">Uplaod Character</h1>
            <UploadCharacter postCharacter={importCharacter.bind(null, campaignID)} />
        </main>
    );
}