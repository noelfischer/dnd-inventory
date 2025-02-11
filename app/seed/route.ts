import { db } from '@vercel/postgres';
import { users, campaigns, characters, campaignUsers, inventory, currency, spellSlots, dashboards, dashboardElements, characterInfos } from '../../lib/placeholder-data';
import { saltAndHashPassword } from '@/lib/utils';
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
      const hashedPassword = await saltAndHashPassword(user.password);
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
      species VARCHAR(50),
      cclass VARCHAR(50),
      level INT DEFAULT 0,
      background VARCHAR(100),
      alignment VARCHAR(50),
      portrait_url VARCHAR(255),
      strength INT DEFAULT 0,
      dexterity INT DEFAULT 0,
      constitution INT DEFAULT 0,
      intelligence INT DEFAULT 0,
      wisdom INT DEFAULT 0,
      charisma INT DEFAULT 0,
      max_hit_points INT DEFAULT 0,
      current_hit_points INT DEFAULT 0,
      temp_hit_points INT DEFAULT 0,
      load_capacity INT DEFAULT 0,
      backpack_capacity INT DEFAULT 60,
      armor_class INT DEFAULT 0,
      speed INT DEFAULT 0,
      inspiration INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedCharacters = await Promise.all(
    characters.map(
      (character) => client.sql`
        INSERT INTO Characters (
          character_id, campaign_id, user_id, name, description, character_type, species, cclass, level, background, alignment,
          portrait_url, strength, dexterity, constitution, intelligence, wisdom, charisma,
          max_hit_points, current_hit_points, temp_hit_points, load_capacity, backpack_capacity,
          armor_class, speed, inspiration
          
        )
        VALUES (
          ${character.id}, ${character.campaign_id}, ${character.user_id}, ${character.name}, ${character.description}, ${character.character_type}, ${character.species},
          ${character.cclass}, ${character.level}, ${character.background}, ${character.alignment}, ${character.portrait_url},
          ${character.strength}, ${character.dexterity}, ${character.constitution}, ${character.intelligence}, ${character.wisdom},
          ${character.charisma}, ${character.max_hit_points}, ${character.current_hit_points}, ${character.temp_hit_points}, ${character.load_capacity}, ${character.backpack_capacity},
          ${character.armor_class}, ${character.speed}, ${character.inspiration}
          
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

async function seedInventory() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS Inventory (
      item_id VARCHAR(10) PRIMARY KEY,
      character_id VARCHAR(10) REFERENCES Characters(character_id) ON DELETE CASCADE,
      i INT DEFAULT 0,
      slot VARCHAR(10),
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
          item_id, character_id, i, slot, item_name, description, ability, weight, category, magic, quantity
        )
        VALUES (
          ${item.id}, ${item.character_id}, ${item.i}, ${item.slot}, ${item.item_name}, ${item.description}, ${item.ability},
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

async function seedSpellSlots() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS SpellSlots (
      spell_slot_id VARCHAR(10) PRIMARY KEY,
      character_id VARCHAR(10) REFERENCES Characters(character_id) ON DELETE CASCADE,
      spell_level INT NOT NULL,
      total_casts INT NOT NULL,
      casts_remaining INT NOT NULL
    );
  `;

  const insertedSpellSlots = await Promise.all(
    spellSlots.map(
      (spellSlot) => client.sql`
        INSERT INTO SpellSlots (spell_slot_id, character_id, spell_level, total_casts, casts_remaining)
        VALUES (${spellSlot.id}, ${spellSlot.character_id}, ${spellSlot.spell_level}, ${spellSlot.total_casts}, ${spellSlot.casts_remaining})
        ON CONFLICT (spell_slot_id) DO NOTHING;
      `,
    ),
  );

  return insertedSpellSlots;
}

async function seedCharacterInfos() {
  await client.sql`
  CREATE TABLE IF NOT EXISTS CharacterInfos (
      character_info_id VARCHAR(10) PRIMARY KEY,
      character_id VARCHAR(10) REFERENCES Characters(character_id) ON DELETE CASCADE,
      abilities TEXT,
      conditions TEXT,
      notes TEXT
    );
  `;

  const insertedCharacterInfos = await Promise.all(
    characterInfos.map(
      (characterInfo) => client.sql`
        INSERT INTO CharacterInfos (character_info_id, character_id, abilities, conditions, notes)
        VALUES (${characterInfo.id}, ${characterInfo.character_id}, ${characterInfo.abilities}, ${characterInfo.conditions}, ${characterInfo.notes})
        ON CONFLICT (character_info_id) DO NOTHING;
      `,
    ),
  );

  return insertedCharacterInfos;
}

async function seedDashboards() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS Dashboards (
      dashboard_id VARCHAR(10) PRIMARY KEY,
      campaign_id VARCHAR(10) REFERENCES Campaigns(campaign_id) ON DELETE CASCADE,
      character_id VARCHAR(10) REFERENCES Characters(character_id) ON DELETE CASCADE,
      visibility VARCHAR(20) NOT NULL,
      name VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertedDashboards = await Promise.all(
    dashboards.map(
      (dashboard) => client.sql`
        INSERT INTO Dashboards (dashboard_id, campaign_id, character_id, visibility, name)
        VALUES (${dashboard.id}, ${dashboard.campaign_id}, ${dashboard.character_id}, ${dashboard.visibility}, ${dashboard.name})
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
    character_id VARCHAR(10) REFERENCES Characters(character_id) ON DELETE CASCADE,
    element_type VARCHAR(50) NOT NULL, -- Type of element (e.g., 'status', 'inventory', '...')
    -- Position and size for different breakpoints
    x_lg INT NOT NULL DEFAULT 0,
    y_lg INT NOT NULL DEFAULT 0,
    w_lg INT NOT NULL DEFAULT 1,
    h_lg INT NOT NULL DEFAULT 1,
    x_md INT,
    y_md INT,
    w_md INT,
    h_md INT,
    x_sm INT,
    y_sm INT,
    w_sm INT,
    h_sm INT,
    x_xs INT,
    y_xs INT,
    w_xs INT,
    h_xs INT,
    x_xxs INT,
    y_xxs INT,
    w_xxs INT,
    h_xxs INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  `;

  // create a constraint for dashboard_id, character_id, element_type
  await client.sql`
    ALTER TABLE DashboardElements
    ADD CONSTRAINT unique_dashboard_element
    UNIQUE (dashboard_id, character_id, element_type);
  `;

  const insertedDashboardElements = await Promise.all(
    dashboardElements.map(
      (element) => client.sql`
        INSERT INTO DashboardElements (element_id, dashboard_id, character_id, element_type, x_lg, y_lg, w_lg, h_lg)
        VALUES (${element.id}, ${element.dashboard_id}, ${element.character_id}, ${element.element_type}, ${element.position_x}, ${element.position_y}, ${element.size_x}, ${element.size_y})
        ON CONFLICT (element_id) DO NOTHING;
      `,
    ),
  );

  return insertedDashboardElements;
}

export async function GET() {
  /*
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
    await seedInventory();
    console.log('Inventory seeded');
    await seedCurrency();
    console.log('Currency seeded');
    await seedSpellSlots();
    console.log('Spell slots seeded');
    await seedCharacterInfos();
    console.log('Character infos seeded');
    await seedDashboards();
    console.log('Dashboards seeded');
    await seedDashboardElements();
    console.log('Dashboard elements seeded');
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    console.error('Error seeding database:', error);
    return Response.json({ error }, { status: 500 });
  }*/
  return new Response('Seeding database is disabled', { status: 403 });
}
