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

const CharacterSchema = z.object({
  name: z.string(),
  description: z.string(),
  character_type: z.string(),
  race: z.string(),
  cclass: z.string(),
  level: z.number(),
  background: z.string(),
  alignment: z.string(),
  portrait_url: z.string().optional(),
  strength: z.number(),
  dexterity: z.number(),
  constitution: z.number(),
  intelligence: z.number(),
  wisdom: z.number(),
  charisma: z.number(),
  max_hit_points: z.number(),
  armor_class: z.number(),
  speed: z.number(),

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

export async function deleteCampaignUser(campaignUserId: string) {
  try {
    await sql`DELETE FROM campaignusers WHERE campaign_user_id = ${campaignUserId}`;
  } catch (e) {
    console.error('Failed to delete campaign user:', e);
    return { message: 'Database Error: Failed to Delete Campaign User.' };
  }
  revalidatePath('/campaigns');
  redirect('/campaigns');
}

//create character
export async function createCharacter(campaignId: string, formData: FormData) {
  const uID = await getUIDFromSession();
  const { name, description, character_type, race, cclass, level, background, alignment, portrait_url, strength, dexterity, constitution, intelligence, wisdom, charisma, max_hit_points, armor_class, speed } = CharacterSchema.parse({
    name: formData.get('name'),
    description: formData.get('description'),
    character_type: formData.get('character_type'),
    race: formData.get('race'),
    class: formData.get('class'),
    level: formData.get('level'),
    background: formData.get('background'),
    alignment: formData.get('alignment'),
    portrait_url: formData.get('portrait_url'),
    strength: formData.get('strength'),
    dexterity: formData.get('dexterity'),
    constitution: formData.get('constitution'),
    intelligence: formData.get('intelligence'),
    wisdom: formData.get('wisdom'),
    charisma: formData.get('charisma'),
    max_hit_points: formData.get('max_hit_points'),
    armor_class: formData.get('armor_class'),
    speed: formData.get('speed'),
  });

  const characterId = nanoid(10);

  try {
    await sql`INSERT INTO characters (character_id, campaign_id, user_id, name, description, character_type, race, class, level, background, alignment, portrait_url, strength, dexterity, constitution, intelligence, wisdom, charisma, max_hit_points, armor_class, speed)
      VALUES (${characterId}, ${campaignId}, ${uID}, ${name}, ${description}, ${character_type}, ${race}, ${cclass}, ${level}, ${background}, ${alignment}, ${portrait_url}, ${strength}, ${dexterity}, ${constitution}, ${intelligence}, ${wisdom}, ${charisma}, ${max_hit_points}, ${armor_class}, ${speed})`;
  } catch (e) {
    console.error('Failed to create character:', e);
    return { message: 'Database Error: Failed to Create Character.' };
  }
  revalidatePath(`/campaigns/${campaignId}`);
  redirect(`/campaigns/${campaignId}`);
}


// update character
export async function updateCharacter(characterId: string, formData: FormData, campaignId: string) {
  const uID = await getUIDFromSession();
  const { name, description, character_type, race, cclass, level, background, alignment, portrait_url, strength, dexterity, constitution, intelligence, wisdom, charisma, max_hit_points, armor_class, speed } = CharacterSchema.parse({
    name: formData.get('name'),
    description: formData.get('description'),
    character_type: formData.get('character_type'),
    race: formData.get('race'),
    class: formData.get('class'),
    level: formData.get('level'),
    background: formData.get('background'),
    alignment: formData.get('alignment'),
    portrait_url: formData.get('portrait_url'),
    strength: formData.get('strength'),
    dexterity: formData.get('dexterity'),
    constitution: formData.get('constitution'),
    intelligence: formData.get('intelligence'),
    wisdom: formData.get('wisdom'),
    charisma: formData.get('charisma'),
    max_hit_points: formData.get('max_hit_points'),
    armor_class: formData.get('armor_class'),
    speed: formData.get('speed'),
  });

  try {
    await sql`UPDATE characters SET name = ${name}, description = ${description}, character_type = ${character_type}, race = ${race}, class = ${cclass}, level = ${level}, background = ${background}, alignment = ${alignment}, portrait_url = ${portrait_url}, strength = ${strength}, dexterity = ${dexterity}, constitution = ${constitution}, intelligence = ${intelligence}, wisdom = ${wisdom}, charisma = ${charisma}, max_hit_points = ${max_hit_points}, armor_class = ${armor_class}, speed = ${speed}
      WHERE character_id = ${characterId} AND campaign_id = ${campaignId} AND user_id = ${uID}`;
  } catch (e) {
    console.error('Failed to update character:', e);
    return { message: 'Database Error: Failed to Update Character.' };
  }
  revalidatePath(`/campaigns/${campaignId}`);
  redirect(`/campaigns/${campaignId}`);
}

// delete character
export async function deleteCharacter(characterId: string, campaignId: string) {
  try {
    await sql`DELETE FROM characters WHERE character_id = ${characterId} AND campaign_id = ${campaignId}`;
  } catch (e) {
    console.error('Failed to delete character:', e);
    return { message: 'Database Error: Failed to Delete Character.' };
  }
  revalidatePath(`/campaigns/${campaignId}`);
  redirect(`/campaigns/${campaignId}`);
}