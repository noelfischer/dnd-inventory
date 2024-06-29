import Link from "next/link";
import { fetchCampaigns } from "../lib/data";
import { Campaign } from "../lib/definitions";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    user?: number;
  };
}) {
  const user = searchParams?.user || '';
  if (!user) {
    return (
      <main>
        <h1>Please log in first</h1>
      </main>
    );
  }

  const campaigns = await fetchCampaigns(user);
  return (
    <main>
      <h1>Campaigns</h1>
      <ul>
        {campaigns.map((campaign: Campaign) => (
          <li key={campaign.campaign_id}>
            <Link href={`/campaign?campaign=${campaign.campaign_id}&user=${user}`}>
              {campaign.name}</Link>
            </li>
        ))}
      </ul>
    </main>
  );
}