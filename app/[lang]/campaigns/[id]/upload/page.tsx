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
import { getDictionary, Locale } from "@/app/[lang]/dictionaries";

export default async function Page(props: { params: Promise<{ id: string, lang: Locale }> }) {
    const params = await props.params;
    const campaignID = params.id;
    const dict = await getDictionary(params.lang);
    const campaign = await fetchCampaign(campaignID);

    return (
        <main>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem><BreadcrumbLink href="/campaigns">{dict.general.campaigns}</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbLink href={`/campaigns/${campaignID}`}>{campaign.name}</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbPage>{dict.uploadCharacter.title}</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-text text-2xl mb-8 bg-banner banner">{dict.uploadCharacter.title}</h1>
            <UploadCharacter postCharacter={importCharacter.bind(null, campaignID)} dict={dict} />
        </main>
    );
}