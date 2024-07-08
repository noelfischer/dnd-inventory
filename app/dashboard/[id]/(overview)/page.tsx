import { fetchCharacter } from '@/app/lib/data';
import { Character } from '../../../lib/definitions';
import { notFound } from 'next/navigation';
import DashboardGridLayout from '@/app/ui/dashboard/DashboardGridLayout';
import NameAndLevel from '@/app/ui/dashboard/elements/NameAndLevel';
import { ReactNode } from 'react';


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
        w_lg: 1,
        h_lg: 2,
      }
    ]
  }


  return (
    <>
      <DashboardGridLayout componentLayout={layout} />
    </>
  );
}