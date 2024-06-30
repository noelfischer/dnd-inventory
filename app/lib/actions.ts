'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';


import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';

// TODO replace uID with the actual user ID
const dmIDPlaceholder = '1';

const FormSchema = z.object({
  dmId: z.string(),
  name: z.string(),
  description: z.string(),
});


export async function getEmailFromSession() {
  const data = await auth();
  return data!.user!.email;
}

export async function getUIDFromSession() {
  try {
    const email = await getEmailFromSession();
    const user = await sql`SELECT user_id FROM users WHERE email=${email}`;
    return user.rows[0].user_id;
  } catch (e) {
    return { message: 'Failed to get user id' };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const user = await signIn('credentials', formData);
    console.log('User:', user);
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



export async function createUser(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = await sql`INSERT INTO users (email, password_hash) VALUES (${email}, ${passwordHash}) RETURNING *`;
    return user.rows[0];
  }
  catch (error) {
    console.error('Failed to create user:', error);
    throw new Error('Failed to create user.');
  }
}

export async function deleteUser(email: string) {
  try {
    await sql`DELETE FROM users WHERE email=${email}`;
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw new Error('Failed to delete user.');
  }
}

export async function createCampaign(formData: FormData) {
  const { dmId, name, description } = FormSchema.parse({
    dmId: await getUIDFromSession(),
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

export async function deleteCampaign(campaignId: string, dmId: string) {
  try {
    if (dmId !== await getUIDFromSession()) {
      await sql`DELETE FROM campaigns WHERE campaign_id = ${campaignId}`;
      revalidatePath('/campaigns');
      redirect('/campaigns');
    } else {
      return { message: 'Only the DM can delete the campaign' };
    }
  } catch (e) {
    return { message: 'Database Error: Failed to Delete Campaign.' };
  }
}