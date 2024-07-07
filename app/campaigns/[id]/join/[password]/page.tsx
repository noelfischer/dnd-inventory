import { addUserToCampaign } from '@/app/lib/actions';
import { fetchCampaign, fetchUsername } from '@/app/lib/data';


export default async function Page({ params }: { params: { id: string, password: string } }) {
  const campaignID = params.id;
  const pw = params.password;

  // Fetch campaign details using the campaign id
  const campaign = await fetchCampaign(campaignID);
  const dmname = await fetchUsername(campaign.dm_id);

  const addUserToCampaignWithId = addUserToCampaign.bind(null, campaignID, pw);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Do you want to join campaign {campaign.name}?
      </h1>
      <div className="pb-3"><span className="text-2xl">{campaign.description || "descriptionless campaign"}</span></div>
      <p className="mb-4">DM: {dmname}</p>
      <form action={addUserToCampaignWithId}>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type='submit'
        >
          Join
        </button>
      </form>
    </div>
  );
};