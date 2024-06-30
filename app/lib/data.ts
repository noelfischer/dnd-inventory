'use server';

import { sql } from '@vercel/postgres';
import {
  User,
  Campaign,
  Character,
  Skill,
  InventoryItem,
  Currency,
  UserSpell,
  GeneralSpell,
  Ability,
  Condition,
  Dashboard,
  DashboardElement,
  SimpleCharacter,
} from './definitions';

// Fetch all users
export async function fetchUsers() {
  try {
    const data = await sql<User>`SELECT * FROM Users`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users.');
  }
}

// Fetch all campaigns
export async function fetchCampaigns(user_id: string) {
  try {
    const data = await sql<Campaign>`SELECT c.campaign_id, c.name, c.dm_id FROM Campaigns c JOIN CampaignUsers cu ON c.campaign_id = cu.campaign_id WHERE cu.user_id = ${user_id}`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch campaigns.');
  }
}

// Fetch campaign by campaign ID
export async function fetchCampaign(campaign_id: string) {
  try {
    const data = await sql<Campaign>`SELECT * FROM Campaigns WHERE campaign_id = ${campaign_id}`;
    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch campaign ID ${campaign_id}.`);
  }
}

// Fetch characters by campaign ID
export async function fetchCharactersByCampaign(campaign_id: string) {
  try {
    const data = await sql<SimpleCharacter>`SELECT character_id, user_id, name, character_type FROM Characters WHERE campaign_id = ${campaign_id}`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch characters for campaign ID ${campaign_id}.`);
  }
}

// Fetch characters by campaign ID and user ID
export async function fetchCharactersByCampaignAndUser(campaign_id: string, user_id: string) {
  try {
    const data = await sql<SimpleCharacter>`SELECT character_id, name, character_type FROM Characters WHERE campaign_id = ${campaign_id} AND user_id = ${user_id}`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch characters for campaign ID ${campaign_id}.`);
  }
}

// Fetch character by character ID
export async function fetchCharacter(character_id: string) {
  try {
    const data = await sql<Character>`SELECT * FROM Characters WHERE character_id = ${character_id}`;
    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch character ID ${character_id}.`);
  }
}

// Fetch skills by character ID
export async function fetchSkillsByCharacter(character_id: string) {
  try {
    const data = await sql<Skill>`SELECT * FROM Skills WHERE character_id = ${character_id}`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch skills for character ID ${character_id}.`);
  }
}

// Fetch inventory by character ID
export async function fetchInventoryByCharacter(character_id: string) {
  try {
    const data = await sql<InventoryItem>`SELECT * FROM Inventory WHERE character_id = ${character_id}`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch inventory for character ID ${character_id}.`);
  }
}

// Fetch currency by character ID
export async function fetchCurrencyByCharacter(character_id: string) {
  try {
    const data = await sql<Currency>`SELECT * FROM Currency WHERE character_id = ${character_id}`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch currency for character ID ${character_id}.`);
  }
}

// Fetch user spells by character ID
export async function fetchUserSpellsByCharacter(character_id: string) {
  try {
    const data = await sql<UserSpell>`SELECT * FROM UserSpells WHERE character_id = ${character_id}`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch user spells for character ID ${character_id}.`);
  }
}

// Fetch all general spells
export async function fetchGeneralSpells() {
  try {
    const data = await sql<GeneralSpell>`SELECT * FROM GeneralSpells`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch general spells.');
  }
}

// Fetch abilities by character ID
export async function fetchAbilitiesByCharacter(character_id: string) {
  try {
    const data = await sql<Ability>`SELECT * FROM Abilities WHERE character_id = ${character_id}`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch abilities for character ID ${character_id}.`);
  }
}

// Fetch conditions by character ID
export async function fetchConditionsByCharacter(character_id: string) {
  try {
    const data = await sql<Condition>`SELECT * FROM Conditions WHERE character_id = ${character_id}`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch conditions for character ID ${character_id}.`);
  }
}

// Fetch dashboards by campaign ID
export async function fetchDashboardsByCampaign(campaign_id: string) {
  try {
    const data = await sql<Dashboard>`SELECT * FROM Dashboards WHERE campaign_id = ${campaign_id}`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch dashboards for campaign ID ${campaign_id}.`);
  }
}

// Fetch dashboard elements by dashboard ID
export async function fetchDashboardElementsByDashboard(dashboard_id: string) {
  try {
    const data = await sql<DashboardElement>`SELECT * FROM DashboardElements WHERE dashboard_id = ${dashboard_id}`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch dashboard elements for dashboard ID ${dashboard_id}.`);
  }
}