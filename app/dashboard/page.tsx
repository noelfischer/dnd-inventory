import { fetchCampaigns } from '@/app/lib/data';
import { Campaign } from '../lib/definitions';

export default async function Page() {
  const campaigns = await fetchCampaigns();
  return (
    <main>
      <h1>Dashboard</h1>
      <ul>
        {campaigns.map((campaign: Campaign) => (
          <li key={campaign.campaign_id}>{campaign.name}</li>
        ))}
      </ul>
    </main>
  );
}