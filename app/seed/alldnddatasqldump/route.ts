import { db } from '@vercel/postgres';

const client = await db.connect();

export async function GET() {
    try {
        // Fetch data from each table
        const users = await client.sql`SELECT * FROM Users`;
        const campaigns = await client.sql`SELECT * FROM Campaigns`;
        const characters = await client.sql`SELECT * FROM Characters`;
        const campaignUsers = await client.sql`SELECT * FROM CampaignUsers`;
        const skills = await client.sql`SELECT * FROM Skills`;
        const inventory = await client.sql`SELECT * FROM Inventory`;
        const currency = await client.sql`SELECT * FROM Currency`;
        const generalSpells = await client.sql`SELECT * FROM GeneralSpells`;
        const userSpells = await client.sql`SELECT * FROM UserSpells`;
        const spellSlots = await client.sql`SELECT * FROM SpellSlots`;
        const abilities = await client.sql`SELECT * FROM Abilities`;
        const conditions = await client.sql`SELECT * FROM Conditions`;
        const dashboards = await client.sql`SELECT * FROM Dashboards`;
        const dashboardElements = await client.sql`SELECT * FROM DashboardElements`;

        // Function to generate INSERT statements
        const generateInsertStatements = (tableName: string, rows: any, primaryKey: string) => {
            return rows.map((row: any) => {
                const columns = Object.keys(row).join(', ');
                const values = Object.values(row).map(value => {
                    if (value === null) return 'NULL';
                    if (value instanceof Date) {
                        // Format the Date object as an ISO string for SQL
                        return `'${value.toISOString()}'`;
                    }
                    return typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value;
                }).join(', ');
                return `INSERT INTO ${tableName} (${columns}) VALUES (${values}) ON CONFLICT (${primaryKey}) DO NOTHING;`;
            }).join('\n');
        };

        // Generate SQL text
        let sqlText = '';
        sqlText += generateInsertStatements('Users', users.rows, 'user_id') + '\n';
        sqlText += generateInsertStatements('Campaigns', campaigns.rows, 'campaign_id') + '\n';
        sqlText += generateInsertStatements('Characters', characters.rows, 'character_id') + '\n';
        sqlText += generateInsertStatements('CampaignUsers', campaignUsers.rows, 'campaign_user_id') + '\n';
        sqlText += generateInsertStatements('Skills', skills.rows, 'skill_id') + '\n';
        sqlText += generateInsertStatements('Inventory', inventory.rows, 'item_id') + '\n';
        sqlText += generateInsertStatements('Currency', currency.rows, 'currency_id') + '\n';
        sqlText += generateInsertStatements('GeneralSpells', generalSpells.rows, 'spell_id') + '\n';
        sqlText += generateInsertStatements('UserSpells', userSpells.rows, 'user_spell_id') + '\n';
        sqlText += generateInsertStatements('SpellSlots', spellSlots.rows, 'spell_slot_id') + '\n';
        sqlText += generateInsertStatements('Abilities', abilities.rows, 'ability_id') + '\n';
        sqlText += generateInsertStatements('Conditions', conditions.rows, 'condition_id') + '\n';
        sqlText += generateInsertStatements('Dashboards', dashboards.rows, 'dashboard_id') + '\n';
        sqlText += generateInsertStatements('DashboardElements', dashboardElements.rows, 'element_id') + '\n';

        return new Response(sqlText, {
            headers: {
                'Content-Type': 'text/plain',
                'Content-Disposition': 'attachment; filename="database_export.sql"',
            },
        });
    } catch (error) {
        console.error('Error generating SQL export:', error);
        return new Response(JSON.stringify({ error: error }), { status: 500 });
    } finally {
        client.release();
    }
}
