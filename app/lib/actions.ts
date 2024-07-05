'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';


import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { fetchCampaign } from './data';

// TODO replace uID with the actual user ID
const dmIDPlaceholder = '1';

const FormSchema = z.object({
  dmId: z.string(),
  name: z.string(),
  description: z.string(),
  password: z.string().optional(),
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
  const { dmId, name, description, password } = FormSchema.parse({
    dmId: await getUIDFromSession(),
    name: formData.get('name'),
    description: formData.get('description'),
    password: formData.get('password'),
  });
  try {
    const campaignId = nanoid(10);
    const campaignUserId = nanoid(10);
    await sql`INSERT INTO campaigns (campaign_id, dm_id, name, description, password) VALUES (${campaignId}, ${dmId}, ${name}, ${description}, ${password || null})`;
    try { // if this fails, we need to rollback the campaign creation
      await sql`INSERT INTO campaignusers (campaign_user_id, campaign_id, user_id) VALUES (${campaignUserId}, ${campaignId}, ${dmId})`;
    }
    catch (e) {
      await sql`DELETE FROM campaigns WHERE campaign_id = ${campaignId}`;
      console.error('Failed to create campaign:', e);
      throw e; // rethrow the error
    }
  }
  catch (e) {
    console.error('Failed to create campaign:', e);
    return { message: 'Database Error: Failed to Create Campaign.' };
  }

  revalidatePath('/campaigns');
  redirect('/campaigns');
}

export async function updateCampaign(campaignId: string, formData: FormData) {
  const { name, description, password } = FormSchema.parse({
    dmId: dmIDPlaceholder,
    name: formData.get('name'),
    description: formData.get('description'),
    password: formData.get('password'),
  });
  try {
    await sql`UPDATE campaigns SET name = ${name}, description = ${description}, password = ${password} WHERE campaign_id = ${campaignId}`;
    console.log('Updated campaign:', campaignId);
  } catch (e) {
    return { message: 'Database Error: Failed to Update Campaign.' };
  }
  revalidatePath(`/campaigns/${campaignId}`);
  redirect('/campaigns');

}

export async function deleteCampaign(campaignId: string, dmId: string) {
  try {
    if (dmId === await getUIDFromSession()) {
      await sql`DELETE FROM campaigns WHERE campaign_id = ${campaignId}`;
    } else {
      console.error('Only the DM can delete the campaign');
      return { message: 'Only the DM can delete the campaign' };
    }
  } catch (e) {
    console.error('Failed to delete campaign:', e);
    return { message: 'Database Error: Failed to Delete Campaign.' };
  }

  revalidatePath('/campaigns');
  redirect('/campaigns');
}

export async function addUserToCampaign(campaignId: string, password: string) {
  const uID = await getUIDFromSession();
  try {
    const campaignUserId = nanoid(10);
    //check if user is already in campaign
    const user = await sql`SELECT * FROM campaignusers WHERE campaign_id = ${campaignId} AND user_id = ${uID}`;
    if (user.rows.length === 0) {
      // if the campaign has a password, check if the password is correct
      const campaign = await fetchCampaign(campaignId);
      if (campaign.password && campaign.password !== password) {
        console.error('Incorrect password');
        return { message: 'Incorrect password' };
      }
      await sql`INSERT INTO campaignusers (campaign_user_id, campaign_id, user_id) VALUES (${campaignUserId}, ${campaignId}, ${uID})`;
    }
  } catch (e) {
    console.error('Failed to add user to campaign:', e);
    return { message: 'Database Error: Failed to Add User to Campaign.' };
  }
  revalidatePath(`/campaigns/${campaignId}`);
  redirect(`/campaigns/${campaignId}`);
}
