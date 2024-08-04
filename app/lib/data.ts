'use server';

import { sql } from '@vercel/postgres';
import { auth } from '@/auth';

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
  CampaignUser,
} from './definitions';


export async function getEmailFromSession() {
  const data = await auth();
  return data!.user!.email;
}

export async function getUIDFromSession() {
  try {
    const email = await getEmailFromSession();
    const user = await sql`SELECT user_id FROM users WHERE email=${email}`;
    return user.rows[0].user_id;
  } catch (e) {
    return { message: 'Failed to get user id' };
  }
}

export async function getUsernameFromSession() {
  try {
    const email = await getEmailFromSession();
    const user = await sql`SELECT username FROM users WHERE email=${email}`;
    return user.rows[0].username;
  } catch (e) {
    return { message: 'Failed to get username' };
  }
}

// Fetch all users
export async function fetchUsersByCampaign(campaign_id: string) {
  try {
    const data = await sql<User>`SELECT u.user_id, u.username FROM Users u JOIN CampaignUsers cu ON u.user_id = cu.user_id WHERE cu.campaign_id = ${campaign_id}`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users.');
  }
}

export async function fetchUsername(user_id: string) {
  try {
    const data = await sql<User>`SELECT username FROM Users WHERE user_id = ${user_id}`;
    return data.rows[0].username;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch username.');
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

// Fetch campaign users by campaign ID
export async function fetchCampaignUsers(campaign_id: string) {
  try {
    const data = await sql<CampaignUser>`SELECT cu.campaign_user_id, u.user_id, u.username FROM Users u JOIN CampaignUsers cu ON u.user_id = cu.user_id WHERE cu.campaign_id = ${campaign_id}`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch campaign users for campaign ID ${campaign_id}.`);
  }
}

// Fetch characters by campaign ID
export async function fetchCharactersByCampaign(campaign_id: string) {
  try {
    const data = await sql<SimpleCharacter>`SELECT character_id, name, current_hit_points, max_hit_points, character_type FROM Characters WHERE campaign_id = ${campaign_id}`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch characters for campaign ID ${campaign_id}.`);
  }
}

// Fetch characters by campaign ID and user ID
export async function fetchCharactersByCampaignAndUser(campaign_id: string, user_id: string) {
  try {
    const data = await sql<SimpleCharacter>`SELECT character_id, name, current_hit_points, max_hit_points, character_type FROM Characters WHERE campaign_id = ${campaign_id} AND user_id = ${user_id}`;
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

// Fetch character name by character ID
export async function fetchCharacterName(character_id: string) {
  try {
    const data = await sql<Character>`SELECT name FROM Characters WHERE character_id = ${character_id}`;
    return data.rows[0].name;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch character name for character ID ${character_id}.`);
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