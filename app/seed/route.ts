import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { users, campaigns, characters, campaignUsers, skills, inventory, currency, userSpells, generalSpells, abilities, conditions, dashboards, dashboardElements } from '../lib/placeholder-data';

const client = await db.connect();

async function seedUsers() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS Users (
      user_id VARCHAR(10) PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO Users (user_id, username, password_hash, email)
        VALUES (${user.id}, ${user.username}, ${hashedPassword}, ${user.email})
        ON CONFLICT (user_id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}

async function seedCampaigns() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS Campaigns (
      campaign_id VARCHAR(10) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      password VARCHAR(100),
      dm_id VARCHAR(10) REFERENCES Users(user_id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedCampaigns = await Promise.all(
    campaigns.map(
      (campaign) => client.sql`
        INSERT INTO Campaigns (campaign_id, name, description, dm_id)
        VALUES (${campaign.id}, ${campaign.name}, ${campaign.description}, ${campaign.dm_id})
        ON CONFLICT (campaign_id) DO NOTHING;
      `,
    ),
  );

  return insertedCampaigns;
}

async function seedCharacters() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS Characters (
      character_id VARCHAR(10) PRIMARY KEY,
      campaign_id VARCHAR(10) REFERENCES Campaigns(campaign_id) ON DELETE CASCADE,
      user_id VARCHAR(10) REFERENCES Users(user_id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      character_type VARCHAR(50) NOT NULL,
      race VARCHAR(50),
      class VARCHAR(50),
      level INT,
      background VARCHAR(100),
      alignment VARCHAR(50),
      portrait_url VARCHAR(255),
      strength INT,
      dexterity INT,
      constitution INT,
      intelligence INT,
      wisdom INT,
      charisma INT,
      max_hit_points INT,
      current_hit_points INT,
      temp_hit_points INT,
      armor_class INT,
      speed INT,
      initiative INT DEFAULT 0,
      death_saves_success INT,
      death_saves_failure INT,
      experience_points INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedCharacters = await Promise.all(
    characters.map(
      (character) => client.sql`
        INSERT INTO Characters (
          character_id, campaign_id, user_id, name, description, character_type, race, class, level, background, alignment,
          portrait_url, strength, dexterity, constitution, intelligence, wisdom, charisma,
          max_hit_points, current_hit_points, temp_hit_points, 
          armor_class, speed, initiative,
          death_saves_success, death_saves_failure, experience_points
        )
        VALUES (
          ${character.id}, ${character.campaign_id}, ${character.user_id}, ${character.name}, ${character.description}, ${character.character_type}, ${character.race},
          ${character.class}, ${character.level}, ${character.background}, ${character.alignment}, ${character.portrait_url},
          ${character.strength}, ${character.dexterity}, ${character.constitution}, ${character.intelligence}, ${character.wisdom},
          ${character.charisma}, ${character.max_hit_points}, ${character.current_hit_points}, ${character.temp_hit_points},
          ${character.armor_class}, ${character.speed}, ${character.initiative},
          ${character.death_saves_success}, ${character.death_saves_failure}, ${character.experience_points}
        )
        ON CONFLICT (character_id) DO NOTHING;
      `,
    ),
  );

  return insertedCharacters;
}

async function seedCampaignUsers() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS CampaignUsers (
      campaign_user_id VARCHAR(10) PRIMARY KEY,
      campaign_id VARCHAR(10) REFERENCES Campaigns(campaign_id) ON DELETE CASCADE,
      user_id VARCHAR(10) REFERENCES Users(user_id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedCampaignUsers = await Promise.all(
    campaignUsers.map(
      (campaignUser) => client.sql`
        INSERT INTO CampaignUsers (campaign_user_id, campaign_id, user_id)
        VALUES (${campaignUser.id}, ${campaignUser.campaign_id}, ${campaignUser.user_id})
        ON CONFLICT (campaign_user_id) DO NOTHING;
      `,
    ),
  );

  return insertedCampaignUsers;
}

async function seedSkills() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS Skills (
      skill_id VARCHAR(10) PRIMARY KEY,
      character_id VARCHAR(10) REFERENCES Characters(character_id) ON DELETE CASCADE,
      skill_name VARCHAR(100),
      proficiency BOOLEAN
    );
  `;

  const insertedSkills = await Promise.all(
    skills.map(
      (skill) => client.sql`
        INSERT INTO Skills (skill_id, character_id, skill_name, proficiency)
        VALUES (${skill.id}, ${skill.character_id}, ${skill.skill_name}, ${skill.proficiency})
        ON CONFLICT (skill_id) DO NOTHING;
      `,
    ),
  );

  return insertedSkills;
}

async function seedInventory() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS Inventory (
      item_id VARCHAR(10) PRIMARY KEY,
      character_id VARCHAR(10) REFERENCES Characters(character_id) ON DELETE CASCADE,
      inventory_name VARCHAR(100),
      item_name VARCHAR(100),
      description TEXT,
      ability TEXT,
      weight DECIMAL,
      category VARCHAR(50),
      magic BOOLEAN,
      quantity INT DEFAULT 1
    );
  `;

  const insertedInventory = await Promise.all(
    inventory.map(
      (item) => client.sql`
        INSERT INTO Inventory (
          item_id, character_id, inventory_name, item_name, description, ability, weight, category, magic, quantity
        )
        VALUES (
          ${item.id}, ${item.character_id}, ${item.inventory_name}, ${item.item_name}, ${item.description}, ${item.ability},
          ${item.weight}, ${item.category}, ${item.magic}, ${item.quantity}
        )
        ON CONFLICT (item_id) DO NOTHING;
      `,
    ),
  );

  return insertedInventory;
}

async function seedCurrency() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS Currency (
      currency_id VARCHAR(10) PRIMARY KEY,
      character_id VARCHAR(10) REFERENCES Characters(character_id) ON DELETE CASCADE,
      platin INT DEFAULT 0,
      gold INT DEFAULT 0,
      silver INT DEFAULT 0,
      copper INT DEFAULT 0
    );
  `;

  const insertedCurrency = await Promise.all(
    currency.map(
      (cur) => client.sql`
        INSERT INTO Currency (currency_id, character_id, platin, gold, silver, copper)
        VALUES (${cur.id}, ${cur.character_id}, ${cur.platin}, ${cur.gold}, ${cur.silver}, ${cur.copper})
        ON CONFLICT (currency_id) DO NOTHING;
      `,
    ),
  );

  return insertedCurrency;
}

async function seedUserSpells() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS UserSpells (
      user_spell_id VARCHAR(10) PRIMARY KEY,
      character_id VARCHAR(10) REFERENCES Characters(character_id) ON DELETE CASCADE,
      spell_id VARCHAR(10) REFERENCES GeneralSpells(spell_id),
      prepared BOOLEAN,
      slots_total INT,
      slots_used INT
    );
  `;

  const insertedUserSpells = await Promise.all(
    userSpells.map(
      (userSpell) => client.sql`
        INSERT INTO UserSpells (user_spell_id, character_id, spell_id, prepared, slots_total, slots_used)
        VALUES (${userSpell.id}, ${userSpell.character_id}, ${userSpell.spell_id}, ${userSpell.prepared}, ${userSpell.slots_total}, ${userSpell.slots_used})
        ON CONFLICT (user_spell_id) DO NOTHING;
      `,
    ),
  );

  return insertedUserSpells;
}

async function seedGeneralSpells() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS GeneralSpells (
      spell_id VARCHAR(10) PRIMARY KEY,
      spell_name VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      spell_level INT NOT NULL
    );
  `;

  const insertedGeneralSpells = await Promise.all(
    generalSpells.map(
      (spell) => client.sql`
        INSERT INTO GeneralSpells (spell_id, spell_name, description, spell_level)
        VALUES (${spell.id}, ${spell.spell_name}, ${spell.description}, ${spell.spell_level})
        ON CONFLICT (spell_id) DO NOTHING;
      `,
    ),
  );

  return insertedGeneralSpells;
}

async function seedAbilities() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS Abilities (
      ability_id VARCHAR(10) PRIMARY KEY,
      character_id VARCHAR(10) REFERENCES Characters(character_id) ON DELETE CASCADE,
      ability_name VARCHAR(100),
      description TEXT
    );
  `;

  const insertedAbilities = await Promise.all(
    abilities.map(
      (ability) => client.sql`
        INSERT INTO Abilities (ability_id, character_id, ability_name, description)
        VALUES (${ability.id}, ${ability.character_id}, ${ability.ability_name}, ${ability.description})
        ON CONFLICT (ability_id) DO NOTHING;
      `,
    ),
  );

  return insertedAbilities;
}

async function seedConditions() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS Conditions (
      condition_id VARCHAR(10) PRIMARY KEY,
      character_id VARCHAR(10) REFERENCES Characters(character_id) ON DELETE CASCADE,
      condition_name VARCHAR(100),
      duration INT,
      impact TEXT
    );
  `;

  const insertedConditions = await Promise.all(
    conditions.map(
      (condition) => client.sql`
        INSERT INTO Conditions (condition_id, character_id, condition_name, duration, impact)
        VALUES (${condition.id}, ${condition.character_id}, ${condition.condition_name}, ${condition.duration}, ${condition.impact})
        ON CONFLICT (condition_id) DO NOTHING;
      `,
    ),
  );

  return insertedConditions;
}

async function seedDashboards() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS Dashboards (
      dashboard_id VARCHAR(10) PRIMARY KEY,
      campaign_id VARCHAR(10) REFERENCES Campaigns(campaign_id) ON DELETE CASCADE,
      character_id VARCHAR(10) REFERENCES Characters(character_id) ON DELETE CASCADE,
      visibility VARCHAR(50) NOT NULL,
      name VARCHAR(100) NOT NULL,
      columns INT DEFAULT 3,
      rows INT DEFAULT 5,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedDashboards = await Promise.all(
    dashboards.map(
      (dashboard) => client.sql`
        INSERT INTO Dashboards (dashboard_id, campaign_id, character_id, visibility, name, columns, rows)
        VALUES (${dashboard.id}, ${dashboard.campaign_id}, ${dashboard.character_id}, ${dashboard.visibility}, ${dashboard.name}, ${dashboard.columns}, ${dashboard.rows})
        ON CONFLICT (dashboard_id) DO NOTHING;
      `,
    ),
  );

  return insertedDashboards;
}

async function seedDashboardElements() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS DashboardElements (
      element_id VARCHAR(10) PRIMARY KEY,
      dashboard_id VARCHAR(10) REFERENCES Dashboards(dashboard_id) ON DELETE CASCADE,
      element_type VARCHAR(50) NOT NULL,
      position_x INT NOT NULL,
      position_y INT NOT NULL,
      size_x INT NOT NULL,
      size_y INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedDashboardElements = await Promise.all(
    dashboardElements.map(
      (element) => client.sql`
        INSERT INTO DashboardElements (element_id, dashboard_id, element_type, position_x, position_y, size_x, size_y)
        VALUES (${element.id}, ${element.dashboard_id}, ${element.element_type}, ${element.position_x}, ${element.position_y}, ${element.size_x}, ${element.size_y})
        ON CONFLICT (element_id) DO NOTHING;
      `,
    ),
  );

  return insertedDashboardElements;
}

export async function GET() {
  console.log('Seeding database...');
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    console.log('Users seeded');
    await seedCampaigns();
    console.log('Campaigns seeded');
    await seedCharacters();
    console.log('Characters seeded');
    await seedCampaignUsers();
    console.log('Campaign users seeded');
    await seedSkills();
    console.log('Skills seeded');
    await seedInventory();
    console.log('Inventory seeded');
    await seedCurrency();
    console.log('Currency seeded');
    await seedGeneralSpells();
    console.log('General spells seeded');
    await seedUserSpells();
    console.log('User spells seeded');
    await seedAbilities();
    console.log('Abilities seeded');
    await seedConditions();
    console.log('Conditions seeded');
    await seedDashboards();
    console.log('Dashboards seeded');
    await seedDashboardElements();
    console.log('Dashboard elements seeded');
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
