'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { nanoid } from 'nanoid';

// TODO replace uID with the actual user ID
const dmIDPlaceholder = '1';

const FormSchema = z.object({
    dmId: z.string(),
    name: z.string(),
    description: z.string(),
});

export async function createCampaign(formData: FormData) {
    const { dmId, name, description } = FormSchema.parse({
        dmId: dmIDPlaceholder,
        name: formData.get('name'),
        description: formData.get('description'),
    });
    const campaignId = nanoid();
    const campaignUserId = nanoid();
    await sql`INSERT INTO campaigns (campaign_id, dm_id, name, description) VALUES (${campaignId}, ${dmId}, ${name}, ${description})`;
    await sql`INSERT INTO campaignusers (campaign_user_id, campaign_id, user_id) VALUES (${campaignUserId}, ${campaignId}, ${dmId})`;
    revalidatePath('/campaigns');
    redirect('/campaigns');
}

export async function updateCampaign(campaignId: string, formData: FormData) {
    const { name, description } = FormSchema.parse({
        dmId: dmIDPlaceholder,
        name: formData.get('name'),
        description: formData.get('description'),
    });
    await sql`UPDATE campaigns SET name = ${name}, description = ${description} WHERE campaign_id = ${campaignId}`;
    revalidatePath(`/campaigns/${campaignId}`);
    redirect('/campaigns');
}

export async function deleteCampaign(campaignId: string) {
    await sql`DELETE FROM campaigns WHERE campaign_id = ${campaignId}`;
    revalidatePath('/campaigns');
    redirect('/campaigns');
}