import Link from "next/link";
import { fetchCampaign, fetchCharactersByCampaign, fetchCharactersByCampaignAndUser } from "../lib/data";
import { Campaign, SimpleCharacter } from "../lib/definitions";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    campaign?: number;
    user?: number;
  };
}) {
  const campaignID = searchParams?.campaign || '';
  const user = searchParams?.user || '';
  if (!campaignID || !user) {
    return (
      <main>
        <h1>404</h1>
      </main>
    );
  }
  const campaign: Campaign = await fetchCampaign(campaignID);
  if (!campaign) {
    return (
      <main>
        <h1>404</h1>
      </main>
    );
  }
  var characters;
  if (campaign.dm_id === user) {
    characters = await fetchCharactersByCampaign(campaignID);
  } else {
    characters = await fetchCharactersByCampaignAndUser(campaignID, user);
  }

  return (
    <main>
      <h1>{campaign.name}</h1>
      <p>{campaign.description}</p>
      <h2>Characters</h2>
      <ul>
        {characters.map((character: SimpleCharacter) => (
          <li key={character.character_id}>
            <Link href={`/dashboard?character=${character.character_id}`}>
              {character.name + ", " + character.character_type}
            </Link></li>
        ))}
      </ul>
    </main>
  );
}