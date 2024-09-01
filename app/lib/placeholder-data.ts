// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data

import { spells } from "./spells";

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
    cclass: 'Zauberer',
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
    load_capacity: 270,
    armor_class: 16,
    speed: 6,
    initiative: 0,
    inspiration: 2,
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

const inventory = [
  {
    id: "fNkZBYJixX",
    character_id: characters[0].id,
    i: 1,
    slot: "eq",
    item_name: 'Longsword',
    description: 'A sharp blade. 1d8 slashing damage.',
    ability: 'None',
    weight: 3.0,
    category: 'W',
    magic: false,
    quantity: 1,
  },
  {
    id: "fNkZBYJixY",
    character_id: characters[0].id,
    i: 2,
    slot: "eq",
    item_name: 'Shield',
    description: 'A sturdy shield. +2 AC.',
    ability: 'None',
    weight: 6.0,
    category: 'A',
    magic: false,
    quantity: 1
  },
  {
    id: "fNkZBYJixZ",
    character_id: characters[0].id,
    i: 3,
    slot: "eq",
    item_name: 'Chain Mail',
    description: 'Heavy armor. 16 AC.',
    ability: 'None',
    weight: 55.0,
    category: 'A',
    magic: false,
    quantity: 1,
  },
  {
    id: "fNkZBYJixB",
    character_id: characters[0].id,
    i: 4,
    slot: "eq",
    item_name: 'Healing Potion',
    description: 'A potion that heals 2d4 + 2 HP.',
    ability: 'None',
    weight: 0.5,
    category: 'C',
    magic: false,
    quantity: 3,
  },
  {
    id: "fNkZBYJixA",
    character_id: characters[0].id,
    i: 5,
    slot: "bp",
    item_name: 'days rations',
    description: 'A pack of food for one day.',
    ability: 'None',
    weight: 2.0,
    category: 'C',
    magic: false,
    quantity: 5,
  },
  {
    id: "fNkZBYJixC",
    character_id: characters[0].id,
    i: 6,
    slot: "bp",
    item_name: 'Rope',
    description: 'A 50-foot coil of rope.',
    ability: 'None',
    weight: 10.0,
    category: 'U',
    magic: false,
    quantity: 1,
  }

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

const userSpells = [
  {
    id: "0wmnbSMP2x",
    character_id: characters[0].id,
    spell_id: spells[0].id,
  },
];

const spellSlots = [
  {
    id: "0wmnbAEG2x",
    character_id: characters[0].id,
    spell_level: 0,
    total_casts: 3,
    casts_remaining: 2,
  },
  {
    id: "0wmnbAEG2y",
    character_id: characters[0].id,
    spell_level: 1,
    total_casts: 2,
    casts_remaining: 2,
  },
  {
    id: "0wmnbAEG2z",
    character_id: characters[0].id,
    spell_level: 2,
    total_casts: 0,
    casts_remaining: 0,
  }
];

const characterInfos = [
  {
    id: "0wmnbAEG24",
    character_id: characters[0].id,
    abilities: "Second Wind\nOnce per short rest, you can use a bonus action to regain 1d10 + 5 HP.",
    conditions: "Poisoned\nDisadvantage on attack rolls and ability checks.",
    notes: "Current quest: Find the lost sword of Arathorn.\nAllies: Gandalf, Legolas, Gimli.",
  }
];

const dashboards = [
  {
    id: "9UGvE_4eDW",
    campaign_id: campaigns[0].id,
    character_id: characters[0].id,
    visibility: 'private',
    name: 'Aaragons Dashboard',
  },
  {
    id: "9UGvE_4eDZ",
    campaign_id: campaigns[0].id,
    character_id: null,
    visibility: 'public',
    name: 'Party Dashboard',
  },
];

const dashboardElements = [
  {
    id: "9UGvE_4eDZ",
    dashboard_id: dashboards[1].id,
    character_id: characters[0].id,
    element_type: 'status',
    position_x: 0,
    position_y: 0,
    size_x: 2,
    size_y: 1,
  },
];

export { users, campaigns, characters, campaignUsers, inventory, currency, userSpells, spellSlots, characterInfos, dashboards, dashboardElements };
