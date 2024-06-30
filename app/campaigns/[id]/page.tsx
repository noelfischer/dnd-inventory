import Link from "next/link";
import { fetchCampaign, fetchCharactersByCampaign, fetchCharactersByCampaignAndUser } from "../../lib/data";
import { Campaign, SimpleCharacter } from "../../lib/definitions";
import { notFound } from "next/navigation";
import { getUIDFromSession } from "@/app/lib/actions";

export default async function Page({ params }: { params: { id: string } }) {
  const uID = await getUIDFromSession();

  const campaignID = params.id;
  
  
  const campaign: Campaign = await fetchCampaign(campaignID);
  if (!campaign) {
    notFound();
  }
  var characters;
  if (campaign.dm_id === uID) {
    characters = await fetchCharactersByCampaign(campaignID);
  } else {
    characters = await fetchCharactersByCampaignAndUser(campaignID, uID);
  }

  return (
    <main>
      <h1>{campaign.name}</h1>
      <p>{campaign.description}</p>
      <h2>Characters</h2>
      <ul>
        {characters.map((character: SimpleCharacter) => (
          <li key={character.character_id}>
            <Link href={`/dashboard/${character.character_id}`}>
              {character.name + ", " + character.character_type}
            </Link></li>
        ))}
      </ul>
    </main>
  );
}