import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  users,
  campaigns,
  characters,
  campaignUsers,
  inventory,
  currency,
  spellSlots,
  characterInfos,
  dashboards,
  dashboardElements,
} from '../lib/placeholder-data';

const prisma = new PrismaClient();

async function seed() {
  const userData = users.map((user) => ({
    user_id: user.id,
    username: user.username,
    email: user.email,
  }));

  const credentialData = await Promise.all(
    users.map(async (user) => ({
      user_id: user.id,
      password_hash: await bcrypt.hash(user.password, 10),
    })),
  );

  await prisma.user.createMany({ data: userData, skipDuplicates: true });
  await prisma.credential.createMany({ data: credentialData, skipDuplicates: true });

  await prisma.campaign.createMany({
    data: campaigns.map((campaign) => ({
      campaign_id: campaign.id,
      name: campaign.name,
      description: campaign.description,
      dm_id: campaign.dm_id,
    })),
    skipDuplicates: true,
  });

  await prisma.character.createMany({
    data: characters.map((character) => ({
      character_id: character.id,
      campaign_id: character.campaign_id,
      user_id: character.user_id,
      name: character.name,
      description: character.description,
      character_type: character.character_type,
      species: character.species,
      cclass: character.cclass,
      level: character.level,
      portrait_url: character.portrait_url,
      strength: character.strength,
      dexterity: character.dexterity,
      constitution: character.constitution,
      intelligence: character.intelligence,
      wisdom: character.wisdom,
      charisma: character.charisma,
      max_hit_points: character.max_hit_points,
      current_hit_points: character.current_hit_points,
      temp_hit_points: character.temp_hit_points,
      load_capacity: character.load_capacity,
      backpack_capacity: character.backpack_capacity,
      armor_class: character.armor_class,
      speed: character.speed,
      inspiration: character.inspiration,
    })),
    skipDuplicates: true,
  });

  await prisma.campaignUser.createMany({
    data: campaignUsers.map((campaignUser) => ({
      campaign_user_id: campaignUser.id,
      campaign_id: campaignUser.campaign_id,
      user_id: campaignUser.user_id,
    })),
    skipDuplicates: true,
  });

  await prisma.inventoryItem.createMany({
    data: inventory.map((item) => ({
      item_id: item.id,
      character_id: item.character_id,
      i: item.i,
      slot: item.slot,
      item_name: item.item_name,
      description: item.description,
      weight: item.weight,
      category: item.category,
      magic: item.magic,
      quantity: item.quantity,
    })),
    skipDuplicates: true,
  });

  await prisma.currency.createMany({
    data: currency.map((cur) => ({
      currency_id: cur.id,
      character_id: cur.character_id,
      platin: cur.platin,
      gold: cur.gold,
      silver: cur.silver,
      copper: cur.copper,
    })),
    skipDuplicates: true,
  });

  await prisma.spellSlot.createMany({
    data: spellSlots.map((spellSlot) => ({
      spell_slot_id: spellSlot.id,
      character_id: spellSlot.character_id,
      spell_level: spellSlot.spell_level,
      total_casts: spellSlot.total_casts,
      casts_remaining: spellSlot.casts_remaining,
    })),
    skipDuplicates: true,
  });

  await prisma.characterInfo.createMany({
    data: characterInfos.map((characterInfo) => ({
      character_info_id: characterInfo.id,
      character_id: characterInfo.character_id,
      abilities: characterInfo.abilities,
      conditions: characterInfo.conditions,
      notes: characterInfo.notes,
    })),
    skipDuplicates: true,
  });

  await prisma.dashboard.createMany({
    data: dashboards.map((dashboard) => ({
      dashboard_id: dashboard.id,
      campaign_id: dashboard.campaign_id,
      character_id: dashboard.character_id,
      visibility: dashboard.visibility,
      name: dashboard.name,
    })),
    skipDuplicates: true,
  });

  await prisma.dashboardElement.createMany({
    data: dashboardElements.map((element) => ({
      element_id: element.id,
      dashboard_id: element.dashboard_id,
      character_id: element.character_id,
      element_type: element.element_type,
      x_lg: element.position_x,
      y_lg: element.position_y,
      w_lg: element.size_x,
      h_lg: element.size_y,
    })),
    skipDuplicates: true,
  });
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
