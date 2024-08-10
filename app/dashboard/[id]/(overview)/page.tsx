import { fetchCampaignIDByDashboard, fetchCharacterByDashboard, fetchDashboardElementsByDashboard, fetchDashboardNumber, fetchNavLinksByDashboard } from '@/app/lib/data';
import { Character, DashboardElement } from '../../../lib/definitions';
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
import { createCharacterDashboard, deleteDashboardByDashboardID, updateDashboardLayout } from '@/app/lib/actions';
import { Layouts } from 'react-grid-layout';
import { NavLink } from '@/app/ui/dashboard/navigation/NavigationWide';

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
  const dashboardLayout: DashboardElement[] = await fetchDashboardElementsByDashboard(dashboardID);
  const character: Character = await fetchCharacterByDashboard(dashboardID);
  const characterID = character ? character.character_id : null;
  const characterName = character ? character.name : "Party";

  const campaignID = await fetchCampaignIDByDashboard(dashboardID);
  const navLinks: NavLink[] = await fetchNavLinksByDashboard(dashboardID);
  console.log("number of dashboards", await fetchDashboardNumber(campaignID, characterID));
  const ableToDeleteDashboard = await fetchDashboardNumber(campaignID, characterID) > 1;

  if (!campaignID) notFound();

  const updateLayout = updateDashboardLayout.bind(null, dashboardID);
  const newDashboard = createCharacterDashboard.bind(null, dashboardID, campaignID, characterID, characterName);
  const deleteDashboard = deleteDashboardByDashboardID.bind(null, dashboardID, campaignID);

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
      <DashboardGridLayout initialComponentList={componentList} initialLayout={layout} updateLayout={updateLayout} navLinks={navLinks} newDashboard={newDashboard} ableToDeleteDashboard={ableToDeleteDashboard} deleteDashboard={deleteDashboard} />
    </>
  );
}

function componentMap(type: string, character_id: string): ReactNode {
  switch (type) {
    case 'name':
      return <NameAndLevel character_id={character_id} />;
    case 'health':
      return <HealthBar character_id={character_id} />;
    case 'attributes':
      return <CharacterAttributes character_id={character_id} />;
    case 'skills':
      return <SkillsList character_id={character_id} />;
    case 'inventory':
      return <InventoryList character_id={character_id} />;
    case 'spells':
      return <SpellList character_id={character_id} />;
    case 'abilities':
      return <AbilitiesList character_id={character_id} />;
    case 'conditions':
      return <ConditionsList character_id={character_id} />;
    case 'currency':
      return <CurrencyOverview character_id={character_id} />;
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
    lg: [{ i: '0000000000,name,' + characterID, x: 0, y: 0, w: 7, h: 1, }, { i: '0000000001,health,' + characterID, x: 0, y: 1, w: 7, h: 2, }, { i: '0000000002,attributes,' + characterID, x: 9, y: 0, w: 3, h: 6, }, { i: '0000000003,skills,' + characterID, x: 7, y: 3, w: 2, h: 5, }, { i: '0000000004,inventory,' + characterID, x: 0, y: 3, w: 7, h: 18, }, { i: '0000000005,spells,' + characterID, x: 7, y: 5, w: 2, h: 6, }, { i: '0000000006,abilities,' + characterID, x: 9, y: 6, w: 3, h: 5, }, { i: '0000000007,conditions,' + characterID, x: 8, y: 11, w: 4, h: 3, }, { i: '00000000008,currency,' + characterID, x: 7, y: 11, w: 1, h: 3, },]
  }
  const initial_componentList = [{ i: '0000000000,name,' + characterID, type: <NameAndLevel character_id={characterID} /> }, { i: '0000000001,health,' + characterID, type: <HealthBar character_id={characterID} /> }, { i: '0000000002,attributes,' + characterID, type: <CharacterAttributes character_id={characterID} /> }, { i: '0000000003,skills,' + characterID, type: <SkillsList character_id={characterID} /> }, { i: '0000000004,inventory,' + characterID, type: <InventoryList character_id={characterID} /> }, { i: '0000000005,spells,' + characterID, type: <SpellList character_id={characterID} /> }, { i: '0000000006,abilities,' + characterID, type: <AbilitiesList character_id={characterID} /> }, { i: '0000000007,conditions,' + characterID, type: <ConditionsList character_id={characterID} /> }, { i: '00000000008,currency,' + characterID, type: <CurrencyOverview character_id={characterID} /> }]
  return { layout: initial_layout, list: initial_componentList }
}