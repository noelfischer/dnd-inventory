'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { nanoid } from 'nanoid';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// TODO replace uID with the actual user ID
const dmIDPlaceholder = '1';

const FormSchema = z.object({
    dmId: z.string(),
    name: z.string(),
    description: z.string(),
});



export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }



export async function createCampaign(formData: FormData) {
    const { dmId, name, description } = FormSchema.parse({
        dmId: dmIDPlaceholder,
        name: formData.get('name'),
        description: formData.get('description'),
    });
    try {
        const campaignId = nanoid();
        const campaignUserId = nanoid();
        await sql`INSERT INTO campaigns (campaign_id, dm_id, name, description) VALUES (${campaignId}, ${dmId}, ${name}, ${description})`;
        try { // if this fails, we need to rollback the campaign creation
            await sql`INSERT INTO campaignusers (campaign_user_id, campaign_id, user_id) VALUES (${campaignUserId}, ${campaignId}, ${dmId})`;
        }
        catch (e) {
            await sql`DELETE FROM campaigns WHERE campaign_id = ${campaignId}`;
            throw e; // rethrow the error
        }
        revalidatePath('/campaigns');
        redirect('/campaigns');
    }
    catch (e) {
        return { message: 'Database Error: Failed to Create Campaign.' };
    }
}

export async function updateCampaign(campaignId: string, formData: FormData) {
    const { name, description } = FormSchema.parse({
        dmId: dmIDPlaceholder,
        name: formData.get('name'),
        description: formData.get('description'),
    });
    try {
        await sql`UPDATE campaigns SET name = ${name}, description = ${description} WHERE campaign_id = ${campaignId}`;
        revalidatePath(`/campaigns/${campaignId}`);
        redirect('/campaigns');
    } catch (e) {
        return { message: 'Database Error: Failed to Update Campaign.' };
    }
}

export async function deleteCampaign(campaignId: string) {
    // a check of the user ID == DM ID should be done here
    try {
        await sql`DELETE FROM campaigns WHERE campaign_id = ${campaignId}`;
        revalidatePath('/campaigns');
        redirect('/campaigns');
    } catch (e) {
        return { message: 'Database Error: Failed to Delete Campaign.' };
    }
}