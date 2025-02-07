import { addUserToCampaign } from '@/lib/actions';
import { fetchCampaign, fetchUsername } from '@/lib/data';
import Button from '@/components/Button';
import { Dices } from 'lucide-react';


export default async function Page(props: { params: Promise<{ id: string, password: string }> }) {
  const params = await props.params;
  const campaignID = params.id;
  const pw = params.password;

  // Fetch campaign details using the campaign id
  const campaign = await fetchCampaign(campaignID);
  const dmname = await fetchUsername(campaign.dm_id);

  const addUserToCampaignWithId = addUserToCampaign.bind(null, campaignID, pw);

  return (
    <div className="pl-3 pt-1 sm:pl-20 sm:pr-10 flex items-center" style={{ height: 'calc(90vh - 90px)' }}>
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-5 border-b-4 border-main">
          Join the Campaign: {campaign.name}?
        </h1>
        <p>{campaign.description || "descriptionless campaign"}</p>
        <p className="mb-8">DM: {dmname}</p>
        <Button className='text-lg w-auto' onClick={addUserToCampaignWithId}>
          Join
          <Dices className='ml-3' />
        </Button>
      </div>
    </div>
  );
};