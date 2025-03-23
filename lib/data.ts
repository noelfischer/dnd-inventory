'use server';

import { auth } from '@/lib/auth';
import { NavLink } from '../app/ui/dashboard/navigation/NavigationWide';

import { Campaign, Character, Currency, Dashboard, DashboardElement, InventoryItem } from '@prisma/client'
import { DashboardWithCharacterType, SimpleCharacter } from './definitions';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function getEmailFromSession(): Promise<string> {
  const data = await auth();
  if (!data) redirect("/login");

  const res = data.user!.email;
  if (!res) throw new Error('No email in session');
  return res;
}

export async function fetchUID(): Promise<string> {
  const email = await getEmailFromSession();
  const user = await prisma.user.findUnique({
    select: { user_id: true },
    where: { email }
  });

  if (!user) throw new Error('User not found');
  return user.user_id;
}

export async function fetchUsernameFromSession(): Promise<string> {
  const email = await getEmailFromSession();
  const user = await prisma.user.findUnique({
    select: { username: true },
    where: { email }
  });

  if (!user) throw new Error('User not found');
  return user.username;
}


// Fetch users by campaign ID
export async function fetchUsersByCampaign(campaign_id: string) {
  return await prisma.campaignUser.findMany({
    where: { campaign_id },
    include: {
      User: { select: { username: true } }
    }
  });
}

//Fetch total user and carachter count seperatly
export async function fetchUserAndCharacterCount() {
  const userCount = await prisma.campaignUser.count();
  const characterCount = await prisma.character.count();

  return { userCount, characterCount };
}

export async function fetchUsername(user_id: string): Promise<string> {
  const user = await prisma.user.findUnique({
    select: { username: true },
    where: { user_id }
  });

  if (!user) throw new Error('User not found');
  return user.username;
}

export async function fetchCampaigns(user_id: string): Promise<Campaign[]> {
  return await prisma.campaign.findMany({
    where: { CampaignUser: { some: { user_id } } }
  });
}

export async function fetchCampaign(campaign_id: string): Promise<Campaign> {
  const res = await prisma.campaign.findUnique({ where: { campaign_id } });
  if (!res) throw new Error('Campaign not found');
  return res;
}

export async function fetchCampaignUsers(campaign_id: string) {
  return await prisma.campaignUser.findMany({
    where: { campaign_id },
    include: {
      User: { select: { username: true } }
    }
  });
}

export async function fetchCharactersByCampaign(campaign_id: string): Promise<SimpleCharacter[]> {
  return await prisma.character.findMany({
    where: { campaign_id },
    select: { character_id: true, name: true, current_hit_points: true, max_hit_points: true, character_type: true }
  });
}

export async function fetchCharactersByCampaignAndUser(campaign_id: string, user_id: string): Promise<SimpleCharacter[]> {
  return await prisma.character.findMany({
    where: { campaign_id, user_id },
    select: { character_id: true, name: true, current_hit_points: true, max_hit_points: true, character_type: true }
  });
}

export async function fetchCharacter(character_id: string): Promise<Character> {
  const character = await prisma.character.findUnique({ where: { character_id } });
  if (!character) throw new Error('Character not found');
  return character;
}

export async function fetchInventoryByCharacter(character_id: string): Promise<InventoryItem[]> {
  return await prisma.inventoryItem.findMany({
    where: { character_id }
  });
}

export async function fetchCurrencyByCharacter(character_id: string): Promise<Currency> {
  const currency = await prisma.currency.findFirst({
    where: { character_id }
  });
  if (!currency) throw new Error('Currency not found');
  return currency;
}

export async function fetchDashboardsByCampaign(campaign_id: string): Promise<Dashboard[]> {
  return await prisma.dashboard.findMany({
    where: { campaign_id }
  });
}

export async function fetchCampaignIDByDashboard(dashboard_id: string): Promise<string> {
  const dashboard = await prisma.dashboard.findUnique({
    select: { campaign_id: true },
    where: { dashboard_id }
  });

  if (!dashboard) throw new Error('Dashboard not found');
  return dashboard.campaign_id;
}

export async function fetchCharacterByDashboard(dashboard_id: string) {
  const dashboard = await prisma.dashboard.findFirst({
    where: { dashboard_id },
    include: { Character: { select: { character_id: true, name: true } } }
  });
  if (!dashboard || !dashboard.Character) return null;
  return dashboard.Character;
}

export async function fetchDashboardElementsByDashboard(dashboard_id: string): Promise<DashboardElement[]> {
  return await prisma.dashboardElement.findMany({
    where: { dashboard_id }
  });
}

// Fetch navigation links by dashboard ID
export async function fetchNavLinksByDashboard(dashboard_id: string): Promise<NavLink[]> {
  const campaign_id = await fetchCampaignIDByDashboard(dashboard_id);

  const characterdata: DashboardWithCharacterType[] = await fetchCharacterNavLinks(campaign_id);
  const campaigndata: DashboardWithCharacterType[] = await fetchCampaignNavLinks(campaign_id);

  const data: DashboardWithCharacterType[] = [...characterdata, ...campaigndata];

  const navLinks: NavLink[] = [];

  for (const dashboard of data) {
    const link = {
      name: dashboard.name,
      id: dashboard.dashboard_id
    };
    const index = navLinks.findIndex(navLink => navLink.name === dashboard.character_type);
    if (index === -1) {
      navLinks.push({ name: dashboard.character_type, links: [link] });
    } else {
      navLinks[index].links.push(link);
    }
  }
  return navLinks;
}

async function fetchCharacterNavLinks(campaign_id: string): Promise<DashboardWithCharacterType[]> {
  const results = await prisma.dashboard.findMany({
    where: {
      campaign_id,
      character_id: { not: null }
    },
    include: {
      Character: {
        select: { character_type: true }
      }
    }
  });

  return results.map(dashboard => ({
    name: dashboard.name,
    dashboard_id: dashboard.dashboard_id,
    character_id: dashboard.character_id!,
    character_type: dashboard.Character?.character_type ?? "Unknown" // Handle potential null values
  }));
}

async function fetchCampaignNavLinks(campaign_id: string): Promise<DashboardWithCharacterType[]> {
  let dashboard: any = await prisma.dashboard.findMany({
    where: {
      campaign_id,
      character_id: null,

    },
    select: { dashboard_id: true, name: true }
  });
  dashboard = dashboard.map((d: any) => {
    d.character_type = "Party";
    return d;
  });
  return dashboard;
}

export async function fetchDashboardNumber(campaignID: string, characterID: string | null): Promise<number> {
  return await prisma.dashboard.count({
    where: { campaign_id: campaignID, character_id: characterID ?? undefined }
  });
}