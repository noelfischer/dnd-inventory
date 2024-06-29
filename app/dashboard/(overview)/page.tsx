import { fetchCharacter } from '@/app/lib/data';
import { Character } from '../../lib/definitions';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    character?: number;
  };
}) {
  const characterID = searchParams?.character || '';
  if (!characterID) {
    return (
      <main>
        <h1>Please log in first</h1>
      </main>
    );
  }

  const character: Character = await fetchCharacter(characterID);
  return (
    <main>
      <h1>Dashboard</h1>
      <h2>{character.name}</h2>
      <p>{character.background}</p>
      <p>{character.race}</p>
      <p>{character.class}</p>
      <p>Level: {character.level}</p>
      <p>Alignment: {character.alignment}</p>

      <h2>Stats</h2>
      <p>Strength: {character.strength}</p>
      <p>Dexterity: {character.dexterity}</p>
      <p>Constitution: {character.constitution}</p>
      <p>Intelligence: {character.intelligence}</p>
      <p>Wisdom: {character.wisdom}</p>
      <p>Charisma: {character.charisma}</p>

      <h2>Hit Points</h2>
      <p>Max HP: {character.max_hit_points}</p>
      <p>Current HP: {character.current_hit_points}</p>
      <p>Temp HP: {character.temp_hit_points}</p>
      <br />
      <p>Death Saves: {character.death_saves_success} successes, {character.death_saves_failure} failures</p>
      <p>XP: {character.experience_points}</p>

    </main>
  );
}