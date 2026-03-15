import { PrismaClient } from '@prisma/client';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { buildSqlExport } from '../lib/sql-export';

const prisma = new PrismaClient();

async function exportSqlDump() {
  const users = await prisma.user.findMany();
  const credentials = await prisma.credential.findMany();
  const accounts = await prisma.account.findMany();
  const campaigns = await prisma.campaign.findMany();
  const characters = await prisma.character.findMany();
  const campaignUsers = await prisma.campaignUser.findMany();
  const inventoryItems = await prisma.inventoryItem.findMany();
  const currency = await prisma.currency.findMany();
  const spellSlots = await prisma.spellSlot.findMany();
  const characterInfos = await prisma.characterInfo.findMany();
  const dashboards = await prisma.dashboard.findMany();
  const dashboardElements = await prisma.dashboardElement.findMany();

  const sqlText = buildSqlExport([
    { tableName: 'User', rows: users, primaryKey: 'user_id' },
    { tableName: 'Credential', rows: credentials, primaryKey: 'user_id' },
    { tableName: 'Account', rows: accounts, primaryKey: 'accountId' },
    { tableName: 'Campaign', rows: campaigns, primaryKey: 'campaign_id' },
    { tableName: 'Character', rows: characters, primaryKey: 'character_id' },
    { tableName: 'CampaignUser', rows: campaignUsers, primaryKey: 'campaign_user_id' },
    { tableName: 'InventoryItem', rows: inventoryItems, primaryKey: 'item_id' },
    { tableName: 'Currency', rows: currency, primaryKey: 'currency_id' },
    { tableName: 'SpellSlot', rows: spellSlots, primaryKey: 'spell_slot_id' },
    { tableName: 'CharacterInfo', rows: characterInfos, primaryKey: 'character_info_id' },
    { tableName: 'Dashboard', rows: dashboards, primaryKey: 'dashboard_id' },
    { tableName: 'DashboardElement', rows: dashboardElements, primaryKey: 'element_id' },
  ]);

  const dateStr = new Date().toISOString().slice(0, 10); // e.g., "2024-06-11"
  const outputPath = resolve(process.cwd(), `database_export_${dateStr}.sql`);
  await writeFile(outputPath, sqlText, 'utf8');
  console.log(`SQL export written to ${outputPath}`);
}

exportSqlDump()
  .catch((error) => {
    console.error('SQL export failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
