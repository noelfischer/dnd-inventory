import { fetchCampaignIDByDashboard, fetchCharacterByDashboard, fetchCharactersByCampaign, fetchCharactersByCampaignAndUser, fetchDashboardElementsByDashboard, fetchDashboardNumber, fetchNavLinksByDashboard, fetchUID } from '@/app/lib/data';
import { SimpleCharacter } from '../../../lib/definitions';
import { notFound } from 'next/navigation';
import DashboardGridLayout from '@/app/ui/dashboard/DashboardGridLayout';
import NameAndLevel from '@/app/ui/dashboard/elements/NameAndLevel';
import { ReactNode } from 'react';
import HealthBarServer from '@/app/ui/dashboard/elements/healthbar/HealthBarServer';
import Abilities from '@/app/ui/dashboard/elements/Abilities';
import Conditions from '@/app/ui/dashboard/elements/Conditions';
import Notes from '@/app/ui/dashboard/elements/Notes';
import { checkDMStatus, createCharacterDashboard, createDashboardElement, deleteDashboardByDashboardID, updateDashboardLayout } from '@/app/lib/actions';
import { Layouts } from 'react-grid-layout';
import { NavLink } from '@/app/ui/dashboard/navigation/NavigationWide';
import { keyValuePair } from '@/app/ui/campaigns/CustomForm';
import SpellSlotsServer from '@/app/ui/dashboard/elements/spellslots/SpellSlotsServer';
import InventoryServer from '@/app/ui/dashboard/elements/inventory/InventoryServer';
import WeightServer from '@/app/ui/dashboard/elements/weight/WeightServer';
import CurrencyServer from '@/app/ui/dashboard/elements/currency/CurrencyServer';
import Inspiration from '@/app/ui/dashboard/elements/Inspiration';
import LongRestServer from '@/app/ui/dashboard/elements/longRest/LongRestServer';
import StatusServer from '@/app/ui/dashboard/elements/status/StatusServer';
import LevelupServer from '@/app/ui/dashboard/elements/levelup/LevelupServer';
import { Character, DashboardElement } from '@prisma/client';

export type GridElement = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export type Component = {
  i: string;
  type: ReactNode;
}

export default async function Page({ params }: { params: { id: string } }) {
  const dashboardID = params.id;
  const uID = await fetchUID();
  const dashboardLayout: DashboardElement[] = await fetchDashboardElementsByDashboard(dashboardID);
  const character = await fetchCharacterByDashboard(dashboardID);
  const characterID = character ? character.character_id : null;
  const partyDashboard = !characterID;
  const characterName = character ? character.name : "Party";
  const campaignID = await fetchCampaignIDByDashboard(dashboardID);
  const navLinks: NavLink[] = await fetchNavLinksByDashboard(dashboardID);
  const ableToDeleteDashboard = await fetchDashboardNumber(campaignID, characterID) > 1;
  const isDM = await checkDMStatus(campaignID, uID);
  let characters = [];
  if (isDM) {
    characters = await fetchCharactersByCampaign(campaignID);
  } else {
    characters = await fetchCharactersByCampaignAndUser(campaignID, uID);
  }
  console.log("partyDashboard", partyDashboard);

  if (!campaignID) notFound();

  const updateLayout = updateDashboardLayout.bind(null, dashboardID);
  const newDashboard = createCharacterDashboard.bind(null, dashboardID, campaignID, characterID, characterName);
  const deleteDashboard = deleteDashboardByDashboardID.bind(null, dashboardID, campaignID);
  const addDashBoardElement = createDashboardElement.bind(null, dashboardID);

  let layout;
  let componentList: Component[];
  if (dashboardLayout.length < 1 && characterID) {
    layout = getLayoutTemplate(characterID).layout;
    componentList = getLayoutTemplate(characterID).list;
  } else {
    layout = transformToLayout(dashboardLayout);
    componentList = dashboardLayout.map(element => { return { i: element.element_id + ',' + element.element_type + ',' + element.character_id, type: componentMap(element.element_type, element.character_id) } })

  }


  return (
    <>
      <DashboardGridLayout
        initialComponentList={componentList}
        initialLayout={layout}
        updateLayout={updateLayout}
        navLinks={navLinks} newDashboard={newDashboard}
        ableToDeleteDashboard={ableToDeleteDashboard}
        deleteDashboard={deleteDashboard}
        characters={formatCharactersData(characters)}
        isPartyDashboard={partyDashboard}
        addElementHandler={addDashBoardElement}
      />
    </>
  );
}

function componentMap(type: string, character_id: string): ReactNode {
  switch (type) {
    case 'name':
      return <NameAndLevel character_id={character_id} />;
    case 'health':
      return <HealthBarServer character_id={character_id} />;
    case 'weight':
      return <WeightServer character_id={character_id} />;
    case 'notes':
      return <Notes character_id={character_id} />;
    case 'inventory':
      return <InventoryServer character_id={character_id} />;
    case 'levelup':
      return <LevelupServer character_id={character_id} />;
    case 'abilities':
      return <Abilities character_id={character_id} />;
    case 'conditions':
      return <Conditions character_id={character_id} />;
    case 'currency':
      return <CurrencyServer character_id={character_id} />;
    case 'spellslots':
      return <SpellSlotsServer character_id={character_id} />;
    case 'inspiration':
      return <Inspiration character_id={character_id} />;
    case 'longrest':
      return <LongRestServer character_id={character_id} />;
    case 'status':
      return <StatusServer character_id={character_id} />;
    default:
      return <div>Unknown component</div>;
  }
}

function transformToLayout(dashboardLayout: DashboardElement[]): Layouts {
  const layout: any = {};

  dashboardLayout.forEach(element => {
    const { element_id, character_id, element_type, x_lg, y_lg, w_lg, h_lg, x_md, y_md, w_md, h_md, x_sm, y_sm, w_sm, h_sm, x_xs, y_xs, w_xs, h_xs, x_xxs, y_xxs, w_xxs, h_xxs } = element;

    const breakpoints: any = {
      lg: { x: x_lg, y: y_lg, w: w_lg, h: h_lg, i: element_id + ',' + element_type + ',' + character_id },
      md: { x: x_md, y: y_md, w: w_md, h: h_md, i: element_id + ',' + element_type + ',' + character_id },
      sm: { x: x_sm, y: y_sm, w: w_sm, h: h_sm, i: element_id + ',' + element_type + ',' + character_id },
      xs: { x: x_xs, y: y_xs, w: w_xs, h: h_xs, i: element_id + ',' + element_type + ',' + character_id },
      xxs: { x: x_xxs, y: y_xxs, w: w_xxs, h: h_xxs, i: element_id + ',' + element_type + ',' + character_id }
    }

    Object.keys(breakpoints).forEach(bp => {
      const { x, y, w, h } = breakpoints[bp];
      if (x !== null && y !== null && w !== null && h !== null) {
        if (!layout[bp]) {
          layout[bp] = [];
        }
        layout[bp].push({
          i: element_id + ',' + element_type + ',' + character_id,
          x,
          y,
          w,
          h
        });
      }
    });
  });

  return layout;
}

function getLayoutTemplate(characterID: string) {
  const initial_layout: Layouts = {
    lg: [
      { i: '0000000000,name,' + characterID, x: 0, y: 0, w: 7, h: 1 },
      { i: '0000000001,health,' + characterID, x: 0, y: 1, w: 7, h: 2 },
      { i: '0000000009,spellslots,' + characterID, x: 0, y: 3, w: 7, h: 2 },
      { i: '0000000002,weight,' + characterID, x: 7, y: 2, w: 2, h: 3 },
      { i: '0000000003,notes,' + characterID, x: 7, y: 15, w: 5, h: 8 },
      { i: '0000000004,inventory,' + characterID, x: 0, y: 5, w: 7, h: 18 },
      { i: '0000000005,levelup,' + characterID, x: 10, y: 0, w: 2, h: 2 },
      { i: '0000000006,abilities,' + characterID, x: 9, y: 4, w: 3, h: 7 },
      { i: '0000000007,conditions,' + characterID, x: 7, y: 11, w: 5, h: 4 },
      { i: '00000000008,currency,' + characterID, x: 7, y: 5, w: 2, h: 6 },
      { i: '00000000010,inspiration,' + characterID, x: 7, y: 0, w: 3, h: 2 },
      { i: '00000000011,longrest,' + characterID, x: 9, y: 2, w: 3, h: 2 },
    ],
  };
  const initial_componentList = [
    { i: '0000000000,name,' + characterID, type: <NameAndLevel character_id={characterID} /> },
    { i: '0000000001,health,' + characterID, type: <HealthBarServer character_id={characterID} /> },
    { i: '0000000009,spellslots,' + characterID, type: <SpellSlotsServer character_id={characterID} /> },
    { i: '0000000002,weight,' + characterID, type: <WeightServer character_id={characterID} /> },
    { i: '0000000003,notes,' + characterID, type: <Notes character_id={characterID} /> },
    { i: '0000000004,inventory,' + characterID, type: <InventoryServer character_id={characterID} /> },
    { i: '0000000005,levelup,' + characterID, type: <LevelupServer character_id={characterID} /> },
    { i: '0000000006,abilities,' + characterID, type: <Abilities character_id={characterID} /> },
    { i: '0000000007,conditions,' + characterID, type: <Conditions character_id={characterID} /> },
    { i: '00000000008,currency,' + characterID, type: <CurrencyServer character_id={characterID} /> },
    { i: '00000000010,inspiration,' + characterID, type: <Inspiration character_id={characterID} /> },
    { i: '00000000011,longrest,' + characterID, type: <LongRestServer character_id={characterID} /> },
  ];
  return { layout: initial_layout, list: initial_componentList };
}

function formatCharactersData(characters: SimpleCharacter[]): keyValuePair[] {
  return characters.map((character) => {
    return { key: character.character_id, value: character.name };
  });
}