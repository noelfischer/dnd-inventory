// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data

const users = [
  {
    username: 'dungeonmaster',
    password: 'dm_password',
    email: 'dm@dungeons.com',
  },
  {
    username: 'player1',
    password: 'player1_password',
    email: 'player1@dungeons.com',
  },
];

const campaigns = [
  {
    name: 'Epic Quest',
    description: 'A grand adventure awaits!',
    dm_id: 1, // assuming the first user is the DM
  },
];

const characters = [
  {
    campaign_id: 1,
    user_id: 2,
    name: 'Aragorn',
    character_type: 'player',
    race: 'Human',
    class: 'Ranger',
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
    death_saves_success: 0,
    death_saves_failure: 0,
    experience_points: 5000,
  },
];

const skills = [
  {
    character_id: 1,
    skill_name: 'Stealth',
    proficiency: true,
  },
];

const inventory = [
  {
    character_id: 1,
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
    character_id: 1,
    platin: 0,
    gold: 150,
    silver: 50,
    copper: 10,
  },
];

const userSpells = [
  {
    character_id: 1,
    spell_id: 1,
    prepared: true,
    slots_total: 3,
    slots_used: 1,
  },
];

const generalSpells = [
  {
    spell_name: 'Fireball',
    description: 'A bright streak flashes from your pointing finger to a point you choose within range.',
    spell_level: 3,
  },
];

const abilities = [
  {
    character_id: 1,
    ability_name: 'Second Wind',
    description: 'Once per short rest, you can use a bonus action to regain 1d10 + 5 HP.',
  },
];

const conditions = [
  {
    character_id: 1,
    condition_name: 'Poisoned',
    duration: 10,
    impact: 'Disadvantage on attack rolls and ability checks.',
  },
];

const dashboards = [
  {
    campaign_id: 1,
    character_id: 1,
    visibility: 'private',
    name: 'Main Dashboard',
    columns: 3,
    rows: 5,
  },
];

const dashboardElements = [
  {
    dashboard_id: 1,
    element_type: 'status',
    element_data: { status: 'Healthy' },
    position_x: 0,
    position_y: 0,
    size_x: 1,
    size_y: 1,
  },
];

export { users, campaigns, characters, skills, inventory, currency, userSpells, generalSpells, abilities, conditions, dashboards, dashboardElements };
