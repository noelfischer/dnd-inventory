// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data

// import { nanoid } from 'nanoid';

const users = [
  {
    id: "3b0Vm5iEFo",
    username: 'dungeonmaster',
    password: 'dm_password',
    email: 'dm@dungeons.com',
  },
  {
    id: "1DFWeGwWse",
    username: 'player1',
    password: 'player1_password',
    email: 'player1@dungeons.com',
  },
];

const campaigns = [
  {
    id: "2mrprEMLbi",
    name: 'Epic Quest',
    description: 'A grand adventure awaits!',
    dm_id: users[0].id, // assuming the first user is the DM
  },
];

const characters = [
  {
    id: "4GGwVH0dqx",
    campaign_id: campaigns[0].id,
    user_id: users[1].id,
    name: 'Aragorn',
    description: 'Son of Arathorn, heir to the throne of Gondor.',
    character_type: 'player',
    race: 'Human',
    cclass: 'Ranger',
    level: 5,
    background: 'Noble',
    alignment: 'Lawful Good',
    portrait_url: '/characters/aragorn.png',
    strength: 18,
    dexterity: 16,
    constitution: 14,
    intelligence: 12,
    wisdom: 14,
    charisma: 16,
    max_hit_points: 45,
    current_hit_points: 45,
    temp_hit_points: 0,
    armor_class: 16,
    speed: 6,
    initiative: 0,
    death_saves_success: 0,
    death_saves_failure: 0,
    experience_points: 5000,
  },
];

const campaignUsers = [
  {
    id: "x_9x1KlbJq",
    campaign_id: campaigns[0].id,
    user_id: users[1].id,
    character_id: characters[0].id,
  },
  {
    id: "f-InpIkKym",
    campaign_id: campaigns[0].id,
    user_id: users[0].id,
    character_id: null,
  }
];

const skills = [
  {
    id: "Y1aZICHbj3",
    character_id: characters[0].id,
    skill_name: 'Stealth',
    proficiency: true,
  },
];

const inventory = [
  {
    id: "fNkZBYJixX",
    character_id: characters[0].id,
    inventory_name: 'Main',
    item_name: 'Longsword',
    description: 'A sharp blade.',
    ability: 'None',
    weight: 3.0,
    category: 'Weapon',
    magic: false,
    quantity: 1,
  },
];

const currency = [
  {
    id: "nKPetzoEQf",
    character_id: characters[0].id,
    platin: 0,
    gold: 150,
    silver: 50,
    copper: 10,
  },
];

const generalSpells = [
  {
    id: "P0pk6JosnJ",
    spell_name: 'Fireball',
    description: 'A bright streak flashes from your pointing finger to a point you choose within range.',
    spell_level: 3,
  },
];

const userSpells = [
  {
    id: "0wmnbSMP2x",
    character_id: characters[0].id,
    spell_id: generalSpells[0].id,
    prepared: true,
    slots_total: 3,
    slots_used: 1,
  },
];

const abilities = [
  {
    id: "UJ6leJdKGc",
    character_id: characters[0].id,
    ability_name: 'Second Wind',
    description: 'Once per short rest, you can use a bonus action to regain 1d10 + 5 HP.',
  },
];

const conditions = [
  {
    id: "FWZ0m_J-Dv",
    character_id: characters[0].id,
    condition_name: 'Poisoned',
    duration: 10,
    impact: 'Disadvantage on attack rolls and ability checks.',
  },
];

const dashboards = [
  {
    id: "9UGvE_4eDW",
    campaign_id: campaigns[0].id,
    character_id: characters[0].id,
    visibility: 'private',
    name: 'Main Dashboard',
    columns: 3,
    rows: 5,
  },
];

const dashboardElements = [
  {
    id: "p9eaYCrTcX",
    dashboard_id: dashboards[0].id,
    element_type: 'status',
    position_x: 0,
    position_y: 0,
    size_x: 1,
    size_y: 1,
  },
];

export { users, campaigns, characters, campaignUsers, skills, inventory, currency, userSpells, generalSpells, abilities, conditions, dashboards, dashboardElements };
