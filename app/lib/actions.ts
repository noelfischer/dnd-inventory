'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { fetchCampaign, getUIDFromSession } from './data';
import { DashboardElement } from './definitions';

const FormSchema = z.object({
  dmId: z.string(),
  name: z.string(),
  description: z.string(),
  password: z.string().optional(),
});

const parseNumber = (val: any) => {
  if (typeof val === 'string') {
    if (val === '') return 0;
    const parsed = parseInt(val);
    if (isNaN(parsed)) throw new Error(`Invalid number: ${val}`);
    return parsed;
  }
  return val;
};

const CharacterSchema = z.object({
  userID: z.string(),
  name: z.string(),
  description: z.string(),
  character_type: z.string(),
  race: z.string(),
  cclass: z.string(),
  level: z.preprocess(parseNumber, z.number()),
  background: z.string(),
  alignment: z.string(),
  portrait_url: z.string().optional(),
  strength: z.preprocess(parseNumber, z.number()),
  dexterity: z.preprocess(parseNumber, z.number()),
  constitution: z.preprocess(parseNumber, z.number()),
  intelligence: z.preprocess(parseNumber, z.number()),
  wisdom: z.preprocess(parseNumber, z.number()),
  charisma: z.preprocess(parseNumber, z.number()),
  max_hit_points: z.preprocess(parseNumber, z.number()),
  armor_class: z.preprocess(parseNumber, z.number()),
  speed: z.preprocess(parseNumber, z.number()),
});

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
          return 'Invalid credentials';
        default:
          return 'Invalid credentials.';
      }
    }
    throw error;
  }
}

export async function logOut() {
  await signOut();
  revalidatePath('/campaigns');
  redirect('/login');

}

export async function signUp(prevState: string | undefined, formData: FormData) {
  try {
    await createUser(formData.get('email') as string, formData.get('password') as string, formData.get('username') as string);
    console.log('Signed up');
  }
  catch (error) {
    console.error('Failed to sign up)', error);
    return 'Email already exists';
  }
  await authenticate(prevState, formData);
}

export async function createUser(email: string, password: string, username: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  const userID = nanoid(10);
  try {
    // check if user already exists
    const existingEmail = await sql`SELECT * FROM users WHERE email=${email}`;
    if (existingEmail.rows.length > 0) {
      console.error('Email already exists');
      throw new Error('Email already exists');
    }
    const user = await sql`INSERT INTO users (user_id, username, password_hash, email) VALUES (${userID}, ${username}, ${passwordHash}, ${email}) RETURNING *`;
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
  const { dmId, name, description, password } = FormSchema.parse({
    dmId: await getUIDFromSession(),
    name: formData.get('name'),
    description: formData.get('description'),
    password: formData.get('password'),
  });
  try {
    await sql`UPDATE campaigns SET name = ${name}, description = ${description}, password = ${password} WHERE campaign_id = ${campaignId}`;
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

export async function deleteCampaignUser(campaignUserId: string, campaignId: string) {
  try {
    await sql`DELETE FROM campaignusers WHERE campaign_user_id = ${campaignUserId}`;
  } catch (e) {
    console.error('Failed to delete campaign user:', e);
    return { message: 'Database Error: Failed to Delete Campaign User.' };
  }
  revalidatePath(`/campaigns/${campaignId}/access`);
  redirect(`/campaigns/${campaignId}/access`);
}

//create character
export async function createCharacter(campaignId: string, formData: FormData) {
  const uID = await getUIDFromSession();
  const { name, description, character_type, race, cclass, level, background, alignment, portrait_url, strength, dexterity, constitution, intelligence, wisdom, charisma, max_hit_points, armor_class, speed } = CharacterSchema.parse({
    userID: uID,
    name: formData.get('name'),
    description: formData.get('description'),
    character_type: formData.get('character_type'),
    race: formData.get('race'),
    cclass: formData.get('cclass'),
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
  const dashboardId = nanoid(10);

  try {
    console.log('Creating character:');
    await sql`INSERT INTO characters (character_id, campaign_id, user_id, name, description, character_type, race, cclass, level, background, alignment, portrait_url, strength, dexterity, constitution, intelligence, wisdom, charisma, max_hit_points, armor_class, speed)
      VALUES (${characterId}, ${campaignId}, ${uID}, ${name}, ${description}, ${character_type}, ${race}, ${cclass}, ${level}, ${background}, ${alignment}, ${portrait_url}, ${strength}, ${dexterity}, ${constitution}, ${intelligence}, ${wisdom}, ${charisma}, ${max_hit_points}, ${armor_class}, ${speed})`;

    await sql`INSERT INTO dashboards (dashboard_id, campaign_id, character_id, visibility, name) VALUES (${dashboardId}, ${campaignId}, ${characterId}, 'private', ${name + "-dashboard-1"})`;

  } catch (e) {
    console.error('Failed to create character:', e);
    return { message: 'Database Error: Failed to Create Character.' };
  }
  revalidatePath(`/campaigns/${campaignId}`);
  redirect(`/campaigns/${campaignId}`);
}


// update character
export async function updateCharacter(characterId: string, campaignId: string, formData: FormData) {
  const { userID, name, description, character_type, race, cclass, level, background, alignment, portrait_url, strength, dexterity, constitution, intelligence, wisdom, charisma, max_hit_points, armor_class, speed } = CharacterSchema.parse({
    userID: formData.get('user_id'),
    name: formData.get('name'),
    description: formData.get('description'),
    character_type: formData.get('character_type'),
    race: formData.get('race'),
    cclass: formData.get('cclass'),
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
    await sql`UPDATE characters SET user_id = ${userID}, name = ${name}, description = ${description}, character_type = ${character_type}, race = ${race}, cclass = ${cclass}, level = ${level}, background = ${background}, alignment = ${alignment}, portrait_url = ${portrait_url}, strength = ${strength}, dexterity = ${dexterity}, constitution = ${constitution}, intelligence = ${intelligence}, wisdom = ${wisdom}, charisma = ${charisma}, max_hit_points = ${max_hit_points}, armor_class = ${armor_class}, speed = ${speed}
      WHERE character_id = ${characterId} AND campaign_id = ${campaignId}`;
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


// duplicate character
export async function duplicateCharacter(characterId: string, campaignId: string, name: string) {
  const uID = await getUIDFromSession();
  const newCharacterId = nanoid(10);
  const dashboardId = nanoid(10);
  try {
    await sql`
      INSERT INTO characters (character_id, campaign_id, user_id, name, description, character_type, race, cclass, level, background, alignment, portrait_url, strength, dexterity, constitution, intelligence, wisdom, charisma, max_hit_points, current_hit_points, temp_hit_points, armor_class, speed, initiative, death_saves_success, death_saves_failure, experience_points)
      SELECT ${newCharacterId}, ${campaignId}, ${uID}, CONCAT(name, '-copy'), description, character_type, race, cclass, level, background, alignment, portrait_url, strength, dexterity, constitution, intelligence, wisdom, charisma, max_hit_points, current_hit_points, temp_hit_points, armor_class, speed, initiative, death_saves_success, death_saves_failure, experience_points
      FROM characters
      WHERE character_id = ${characterId} AND campaign_id = ${campaignId}
    `;

    await sql`INSERT INTO dashboards (dashboard_id, campaign_id, character_id, visibility, name) VALUES (${dashboardId}, ${campaignId}, ${newCharacterId}, 'private', ${name + "-copy-dashboard-1"})`;

  } catch (e) {
    console.error('Failed to create character:', e);
    return { message: 'Database Error: Failed to Create Character.' };
  }
  revalidatePath(`/campaigns/${campaignId}`);
  redirect(`/campaigns/${campaignId}`);
}

// update dashboard layout
export async function updateDashboardLayout(dashboardId: string, layout: any) {
  try {
    var dashboardElement: DashboardElement[] = [];
    for (const breakpoint in layout) {
      if (layout.hasOwnProperty(breakpoint)) {
        for (const element of layout[breakpoint]) {
          const { w, h, x, y, i } = element;

          let column: DashboardElement
          const columnExists = dashboardElement.find((column) => column.element_id + "," + column.element_type === i);
          if (columnExists !== undefined && columnExists) {
            column = columnExists;
          } else {
            let id: string = i.split(",")[0];
            if (id.substring(0, 8) === "00000000") {
              id = nanoid(10);
            }
            column = { element_id: id, element_type: i.split(",")[1], dashboard_id: dashboardId };
            dashboardElement.push(column);
          }

          switch (breakpoint) {
            case 'lg':
              column.x_lg = x;
              column.y_lg = y;
              column.w_lg = w;
              column.h_lg = h;
              break;
            case 'md':
              column.x_md = x;
              column.y_md = y;
              column.w_md = w;
              column.h_md = h;
              break;
            case 'sm':
              column.x_sm = x;
              column.y_sm = y;
              column.w_sm = w;
              column.h_sm = h;
              break;
            case 'xs':
              column.x_xs = x;
              column.y_xs = y;
              column.w_xs = w;
              column.h_xs = h;
              break;
            case 'xxs':
              column.x_xxs = x;
              column.y_xxs = y;
              column.w_xxs = w;
              column.h_xxs = h;
              break;
          }
        }
      }
    }

    for (const element of dashboardElement) {
      await sql`INSERT INTO dashboardelements (element_id, dashboard_id, element_type, x_lg, y_lg, w_lg, h_lg, x_md, y_md, w_md, h_md, x_sm, y_sm, w_sm, h_sm, x_xs, y_xs, w_xs, h_xs, x_xxs, y_xxs, w_xxs, h_xxs)
        VALUES (${element.element_id}, ${element.dashboard_id}, ${element.element_type}, ${element.x_lg}, ${element.y_lg}, ${element.w_lg}, ${element.h_lg}, ${element.x_md}, ${element.y_md}, ${element.w_md}, ${element.h_md}, ${element.x_sm}, ${element.y_sm}, ${element.w_sm}, ${element.h_sm}, ${element.x_xs}, ${element.y_xs}, ${element.w_xs}, ${element.h_xs}, ${element.x_xxs}, ${element.y_xxs}, ${element.w_xxs}, ${element.h_xxs})
        ON CONFLICT (element_id) DO UPDATE SET
          x_lg = ${element.x_lg}, y_lg = ${element.y_lg}, w_lg = ${element.w_lg}, h_lg = ${element.h_lg},
          x_md = ${element.x_md}, y_md = ${element.y_md}, w_md = ${element.w_md}, h_md = ${element.h_md},
          x_sm = ${element.x_sm}, y_sm = ${element.y_sm}, w_sm = ${element.w_sm}, h_sm = ${element.h_sm},
          x_xs = ${element.x_xs}, y_xs = ${element.y_xs}, w_xs = ${element.w_xs}, h_xs = ${element.h_xs},
          x_xxs = ${element.x_xxs}, y_xxs = ${element.y_xxs}, w_xxs = ${element.w_xxs}, h_xxs = ${element.h_xxs}`;
    }
  } catch (e) {
    console.error('Failed to update dashboard layout:', e);
    return { message: 'Database Error: Failed to Update Dashboard Layout.' };
  }

  revalidatePath(`/dashboard/${dashboardId}`);
  redirect(`/dashboard/${dashboardId}`);
}
