import { fetchCharacter } from '@/app/lib/data';
import { Character } from '../../../lib/definitions';
import { notFound } from 'next/navigation';
import DashboardGridLayout from '@/app/ui/dashboard/DashboardGridLayout';
import NameAndLevel from '@/app/ui/dashboard/elements/NameAndLevel';
import { ReactNode } from 'react';
import HealthBar from '@/app/ui/dashboard/elements/HealthBar';
import AbilitiesList from '@/app/ui/dashboard/elements/AbilitiesList';
import CharacterAttributes from '@/app/ui/dashboard/elements/CharacterAttributes';
import ConditionsList from '@/app/ui/dashboard/elements/ConditionsList';
import CurrencyOverview from '@/app/ui/dashboard/elements/CurrencyOverview';
import InventoryList from '@/app/ui/dashboard/elements/InventoryList';
import SkillsList from '@/app/ui/dashboard/elements/SkillsList';
import SpellList from '@/app/ui/dashboard/elements/SpellList';


export type Component = {
  i: string;
  type: ReactNode;
  x_lg: number;
  y_lg: number;
  w_lg: number;
  h_lg: number;
  x_md?: number;
  y_md?: number;
  w_md?: number;
  h_md?: number;
  x_sm?: number;
  y_sm?: number;
  w_sm?: number;
  h_sm?: number;
  x_xs?: number;
  y_xs?: number;
  w_xs?: number;
  h_xs?: number;
  x_xxs?: number;
  y_xxs?: number;
  w_xxs?: number;
  h_xxs?: number;
}

export type ComponentLayout = {
  id: string;
  components: Component[];
}

export default async function Page({ params }: { params: { id: string } }) {
  const characterID = params.id;
  const character: Character = await fetchCharacter(characterID);
  if (!character) notFound();

  const layout: ComponentLayout = {
    id: "1",
    components: [
      {
        i: 'name',
        type: <NameAndLevel character_id={characterID} />,
        x_lg: 0,
        y_lg: 0,
        w_lg: 7,
        h_lg: 1,
      },
      {
        i: 'health',
        type: <HealthBar character_id={characterID} />,
        x_lg: 0,
        y_lg: 1,
        w_lg: 7,
        h_lg: 2,
      },
      {
        i: 'attributes',
        type: <CharacterAttributes character_id={characterID} />,
        x_lg: 9,
        y_lg: 0,
        w_lg: 3,
        h_lg: 6,
      },
      {
        i: 'skills',
        type: <SkillsList character_id={characterID} />,
        x_lg: 7,
        y_lg: 3,
        w_lg: 2,
        h_lg: 5,
      },
      {
        i: 'inventory',
        type: <InventoryList character_id={characterID} />,
        x_lg: 0,
        y_lg: 3,
        w_lg: 7,
        h_lg: 6,
      },
      {
        i: 'spells',
        type: <SpellList character_id={characterID} />,
        x_lg: 7,
        y_lg: 5,
        w_lg: 2,
        h_lg: 6,
      },
      {
        i: 'abilities',
        type: <AbilitiesList character_id={characterID} />,
        x_lg: 9,
        y_lg: 6,
        w_lg: 3,
        h_lg: 5,
      },
      {
        i: 'conditions',
        type: <ConditionsList character_id={characterID} />,
        x_lg: 1,
        y_lg: 9,
        w_lg: 6,
        h_lg: 3,
      },
      {
        i: 'currency',
        type: <CurrencyOverview character_id={characterID} />,
        x_lg: 0,
        y_lg: 9,
        w_lg: 1,
        h_lg: 3,
      },
    ]
  }


  return (
    <>
      <DashboardGridLayout componentLayout={layout} />
    </>
  );
}