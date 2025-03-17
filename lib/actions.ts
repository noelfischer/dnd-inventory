'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { nanoid } from 'nanoid';

import { signIn, signOut } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { fetchCampaign, fetchDashboardNumber, fetchUID } from './data';
import { DashboardElement } from '@prisma/client';
import { saltAndHashPassword } from './utils';
import { prisma } from '@/lib/prisma';
import { CharacterSchema, ExportCharacter, ExportCharacterSchema } from './definitions';
import { cookies } from 'next/headers'

async function getLocale() {
  const cookieStore = await cookies()
  const locale = cookieStore.get("locale")?.value
  return locale || "en"
}

async function getLocaleWithDash() {
  const locale = await getLocale()
  return `/${locale}`
}

const FormSchema = z.object({
  dmId: z.string(),
  name: z.string(),
  description: z.string(),
  password: z.string().optional(),
});

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const user = await signIn('credentials', { email: formData.get("email"), password: formData.get("password"), redirectTo: '/campaigns', redirect: true });
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

export async function loginGoogle() {
  await signIn("google", { redirectTo: "/campaigns", redirect: true });
}

export async function logOut() {
  const locale = await getLocaleWithDash();
  console.log(locale + '/login');
  await signOut({ redirectTo: locale + '/login' });
  revalidatePath(locale + '/campaigns');
  redirect(locale + '/login');

}

export async function signUp(prevState: string | undefined, formData: FormData) {
  try {
    await createUser(formData.get('email') as string, formData.get('password') as string, formData.get('username') as string);
    console.log('Signed up');
  }
  catch (error) {
    console.error('Failed to sign up)', error, "Input: \n", "Email: ", formData.get('email'), "\n", "Username: ", formData.get('username'));
    return 'Email already exists';
  }
  await authenticate(prevState, formData);
}

export async function createUser(email: string, password: string, username: string) {
  const passwordHash = await saltAndHashPassword(password);
  const userID = nanoid(10);
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.error("Failed to create user:", "User already exists", "Input: \n", "Email: ", email, "\n", "Username: ", username);
    throw new Error("Failed to create user.");
  }
  const [user] = await prisma.$transaction([
    prisma.user.create({
      data: { user_id: userID, username, email },
    }),
    prisma.credential.create({
      data: { user_id: userID, password_hash: passwordHash },
    }),
  ]);

  return user;
}

export async function deleteUser(email: string) {
  try {
    await prisma.user.delete({ where: { email } });
  } catch (error) {
    console.error('Failed to delete user:', error, "Input: \n", "Email: ", email);
    throw new Error('Failed to delete user.');
  }
}

export async function checkDMStatus(campaign_id: string, uID: string) {
  const campaign = await prisma.campaign.findUnique({ where: { campaign_id }, select: { dm_id: true } });
  if (!campaign) throw new Error('Campaign not found');
  return uID === campaign.dm_id;
}

export async function createCampaign(formData: FormData) {
  const { dmId, name, description, password } = FormSchema.parse({
    dmId: await fetchUID(),
    name: formData.get('name'),
    description: formData.get('description'),
    password: formData.get('password'),
  });
  try {
    const campaignId = nanoid(10);
    const campaignUserId = nanoid(10);
    const dashboardId = nanoid(10);

    await prisma.campaign.create({
      data: {
        campaign_id: campaignId,
        dm_id: dmId,
        name,
        description,
        password,
        CampaignUser: { create: { campaign_user_id: campaignUserId, user_id: dmId } },
        Dashboard: { create: { dashboard_id: dashboardId, visibility: "public", name: "Party Dashboard" } },
      },
    });
  }
  catch (e) {
    console.error('Failed to create campaign:', e, "Input: \n", "DM ID: ", dmId, "\n", "Name: ", name);
    return { message: 'Database Error: Failed to Create Campaign.' };
  }

  revalidatePath('/campaigns');
  redirect('/campaigns');
}

export async function updateCampaign(campaign_id: string, formData: FormData) {
  const { dmId, name, description, password } = FormSchema.parse({
    dmId: await fetchUID(),
    name: formData.get('name'),
    description: formData.get('description'),
    password: formData.get('password'),
  });
  try {
    await prisma.campaign.update({
      where: { campaign_id },
      data: {
        name,
        description,
        password,
      },
    })
  } catch (e) {
    console.error('Failed to update campaign:', e, "Input: \n", "Campaign ID: ", campaign_id);
    return { message: 'Database Error: Failed to Update Campaign.' };
  }
  revalidatePath(`/campaigns/${campaign_id}`);
  redirect('/campaigns');

}

export async function deleteCampaign(campaign_id: string, dmId: string) {
  try {
    if (dmId === await fetchUID()) {
      await prisma.campaign.delete({ where: { campaign_id } });
    } else {
      console.error('Only the DM can delete the campaign');
      return { message: 'Only the DM can delete the campaign' };
    }
  } catch (e) {
    console.error('Failed to delete campaign:', e, "Input: \n", "Campaign ID: ", campaign_id, "\n", "DM ID: ", dmId);
    return { message: 'Database Error: Failed to Delete Campaign.' };
  }

  revalidatePath('/campaigns');
  redirect('/campaigns');
}

export async function addUserToCampaign(campaign_id: string, password: string) {
  const uID = await fetchUID();
  try {
    const campaignUserId = nanoid(10);
    //check if user is already in campaign
    const user = await prisma.campaignUser.findMany({ where: { campaign_id, user_id: uID } });
    if (user.length === 0) {
      // if the campaign has a password, check if the password is correct
      const campaign = await fetchCampaign(campaign_id);
      if (campaign.password && campaign.password !== password) {
        console.error('Incorrect password');
        return { message: 'Incorrect password' };
      }
      await prisma.campaignUser.create({
        data: { campaign_user_id: campaignUserId, campaign_id, user_id: uID },
      });
    }
  } catch (e) {
    console.error('Failed to add user to campaign:', e, "Input: \n", "Campaign ID: ", campaign_id, "\n", "User ID: ", uID);
    return { message: 'Database Error: Failed to Add User to Campaign.' };
  }
  revalidatePath(`/campaigns/${campaign_id}`);
  redirect(`/campaigns/${campaign_id}`);
}

export async function deleteCampaignUser(campaign_user_id: string, campaignId: string): Promise<void | { message: string }> {
  try {
    await prisma.campaignUser.delete({ where: { campaign_user_id } });
  } catch (e) {
    console.error('Failed to delete campaign user:', e, "Input: \n", "Campaign User ID: ", campaign_user_id, "\n", "Campaign ID: ", campaignId);
    return { message: 'Database Error: Failed to Delete Campaign User.' };
  }
  revalidatePath(`/campaigns/${campaignId}/access`);
  redirect(`/campaigns/${campaignId}/access`);
}

//create character
export async function createCharacter(campaign_id: string, formData: FormData) {
  const uID = await fetchUID();
  let data = {
    character_id: nanoid(10), campaign_id, load_capacity: 0, ...CharacterSchema.parse({
      user_id: uID, name: formData.get('name'), description: formData.get('description'), character_type: formData.get('character_type'), species: formData.get('species'), cclass: formData.get('cclass'), level: formData.get('level'), portrait_url: formData.get('portrait_url'), strength: formData.get('strength'), dexterity: formData.get('dexterity'), constitution: formData.get('constitution'), intelligence: formData.get('intelligence'), wisdom: formData.get('wisdom'), charisma: formData.get('charisma'), max_hit_points: formData.get('max_hit_points'), armor_class: formData.get('armor_class'),
    })
  };
  data.load_capacity = 15 * data.strength;

  try {
    await prisma.character.create({
      data: {
        ...data,
        Dashboard: { create: { dashboard_id: nanoid(10), campaign_id, visibility: "private", name: `${data.name}-Dashboard-1` } },
        Currency: { create: { currency_id: nanoid(10) } },
        CharacterInfo: { create: { character_info_id: nanoid(10) } },
      },
    });
  } catch (e) {
    console.error('Failed to create character:', e, "Input: \n", "Campaign ID: ", campaign_id, "\n", "Name: ", name);
    return { message: 'Database Error: Failed to Create Character.' };
  }
  revalidatePath(`/campaigns/${campaign_id}`);
  redirect(`/campaigns/${campaign_id}`);
}


// update character
export async function updateCharacter(character_id: string, campaign_id: string, formData: FormData) {
  let data = {
    character_id: character_id, campaign_id, load_capacity: 0, ...CharacterSchema.parse({
      user_id: formData.get('user_id'), name: formData.get('name'), description: formData.get('description'), character_type: formData.get('character_type'), species: formData.get('species'), cclass: formData.get('cclass'), level: formData.get('level'), portrait_url: formData.get('portrait_url'), strength: formData.get('strength'), dexterity: formData.get('dexterity'), constitution: formData.get('constitution'), intelligence: formData.get('intelligence'), wisdom: formData.get('wisdom'), charisma: formData.get('charisma'), max_hit_points: formData.get('max_hit_points'), armor_class: formData.get('armor_class'),
    })
  };
  data.load_capacity = 15 * data.strength;

  try {
    await prisma.character.update({
      where: { character_id, campaign_id },
      data,
    });
  } catch (e) {
    console.error('Failed to update character:', e, "Input: \n", "Character ID: ", character_id, "\n", "Campaign ID: ", campaign_id);
    return { message: 'Database Error: Failed to Update Character.' };
  }
  revalidatePath(`/campaigns/${campaign_id}`);
  redirect(`/campaigns/${campaign_id}`);
}

// delete character
export async function deleteCharacter(character_id: string, campaign_id: string) {
  try {
    await prisma.character.delete({ where: { character_id, campaign_id } });
  } catch (e) {
    console.error('Failed to delete character:', e, "Input: \n", "Character ID: ", character_id, "\n", "Campaign ID: ", campaign_id);
    return { message: 'Database Error: Failed to Delete Character.' };
  }
  revalidatePath(`/campaigns/${campaign_id}`);
  redirect(`/campaigns/${campaign_id}`);
}

// move character to another campaign
export async function moveCharacter(character_id: string, campaign_id: string, formData: FormData): Promise<void> {
  const newCampaignId: string = z.string().parse(formData.get('new_campaign_id'));

  if (newCampaignId === campaign_id) {
    redirect(`/campaigns/${campaign_id}`);
  }
  console.log('Moving character:', character_id, campaign_id, newCampaignId);
  try {
    await prisma.$transaction([
      prisma.character.updateMany({
        where: { character_id, campaign_id },
        data: { campaign_id: newCampaignId },
      }),
      prisma.dashboard.updateMany({
        where: { character_id, campaign_id },
        data: { campaign_id: newCampaignId },
      }),
    ]);
  } catch (e) {
    console.error('Failed to move character:', e, "Input: \n", "Character ID: ", character_id, "\n", "Campaign ID: ", campaign_id, "\n", "New Campaign ID: ", newCampaignId);
    return;
  }
  revalidatePath(`/campaigns/${campaign_id}`);
  revalidatePath(`/campaigns/${newCampaignId}`);
  redirect(`/campaigns/${campaign_id}`);
}


// duplicate character
export async function duplicateCharacter(character_id: string, campaign_id: string, name: string) {
  const uID = await fetchUID();
  const newCharacterId = nanoid(10);
  const dashboard_id = nanoid(10);
  try {
    const originalCharacter = await prisma.character.findUnique({
      where: { character_id },
    });

    if (!originalCharacter) throw new Error('Character not found');

    await prisma.character.create({
      data: {
        ...originalCharacter,
        character_id: newCharacterId,
        user_id: uID,
        name: `${name}-Copy`,
      },
    });

    await prisma.dashboard.create({
      data: {
        dashboard_id,
        campaign_id,
        character_id: newCharacterId,
        visibility: 'private',
        name: `${name}-Copy-Dashboard-1`,
      },
    });
  } catch (e) {
    console.error('Failed to create character:', e, "Input: \n", "Character ID: ", character_id, "\n", "Campaign ID: ", campaign_id, "\n", "Name: ", name);
    return { message: 'Database Error: Failed to Create Character.' };
  }
  revalidatePath(`/campaigns/${campaign_id}`);
  redirect(`/campaigns/${campaign_id}`);
}

export async function exportCharacter(character_id: string) {
  const character = await prisma.character.findUnique({
    where: { character_id },
    include: {
      InventoryItem: true,
      Currency: true,
      SpellSlot: true,
      CharacterInfo: true,
    }
  });
  if (!character) throw new Error('Character not found');
  const exportCharacter = ExportCharacterSchema.parse({
    name: character.name,
    description: character.description,
    character_type: character.character_type,
    species: character.species || '',
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
    Inventory: character.InventoryItem.map((item) => {
      return {
        i: item.i,
        slot: item.slot,
        name: item.item_name,
        description: item.description,
        category: item.category,
        weight: item.weight,
        quantity: item.quantity,
        magic: item.magic,
      };
    }),
    Currency: {
      platinum: character.Currency[0].platin,
      gold: character.Currency[0].gold,
      silver: character.Currency[0].silver,
      copper: character.Currency[0].copper,
    },
    CharacterInfo: {
      abilities: character.CharacterInfo[0].abilities || '',
      conditions: character.CharacterInfo[0].conditions || '',
      notes: character.CharacterInfo[0].notes || '',
    },
    SpellSlot: character.SpellSlot.map((slot) => {
      return {
        level: slot.spell_level,
        total_casts: slot.total_casts,
        casts_remaining: slot.casts_remaining,
      };
    })
  });

  return exportCharacter;
}

export async function importCharacter(campaign_id: string, character: ExportCharacter) {
  const uID = await fetchUID();
  const importedCharacter = ExportCharacterSchema.parse(character);
  console.log('Imported character:', importedCharacter);
  try {
    await prisma.character.create({
      data: {
        character_id: nanoid(10),
        campaign_id,
        user_id: uID,
        name: importedCharacter.name,
        description: importedCharacter.description,
        character_type: importedCharacter.character_type,
        species: importedCharacter.species,
        cclass: importedCharacter.cclass,
        level: importedCharacter.level,
        portrait_url: importedCharacter.portrait_url,
        strength: importedCharacter.strength,
        dexterity: importedCharacter.dexterity,
        constitution: importedCharacter.constitution,
        intelligence: importedCharacter.intelligence,
        wisdom: importedCharacter.wisdom,
        charisma: importedCharacter.charisma,
        max_hit_points: importedCharacter.max_hit_points,
        current_hit_points: importedCharacter.current_hit_points,
        temp_hit_points: importedCharacter.temp_hit_points,
        load_capacity: importedCharacter.load_capacity,
        armor_class: importedCharacter.armor_class,
        Dashboard: {
          create: {
            dashboard_id: nanoid(10),
            campaign_id,
            visibility: 'private',
            name: `${importedCharacter.name}-Dashboard-1`,
          }
        },
        Currency: {
          create: {
            currency_id: nanoid(10),
            platin: importedCharacter.Currency.platinum,
            gold: importedCharacter.Currency.gold,
            silver: importedCharacter.Currency.silver,
            copper: importedCharacter.Currency.copper,
          }
        },
        CharacterInfo: {
          create: {
            character_info_id: nanoid(10),
            abilities: importedCharacter.CharacterInfo.abilities,
            conditions: importedCharacter.CharacterInfo.conditions,
            notes: importedCharacter.CharacterInfo.notes,
          }
        },
        InventoryItem: {
          create: importedCharacter.Inventory.map((item) => {
            return {
              item_id: nanoid(10),
              i: item.i,
              slot: item.slot,
              item_name: item.name,
              description: item.description,
              category: item.category,
              weight: item.weight,
              quantity: item.quantity,
              magic: item.magic,
            };
          }),
        },
        SpellSlot: {
          create: importedCharacter.SpellSlot.map((slot) => {
            return {
              spell_slot_id: nanoid(10),
              spell_level: slot.level,
              total_casts: slot.total_casts,
              casts_remaining: slot.casts_remaining,
            };
          }),
        },
      },
    });

  } catch (e) {
    console.error('Failed to import character:', e, "Input: \n", "Campaign ID: ", campaign_id);
    return { message: 'Database Error: Failed to Import Character.' };
  }
  revalidatePath(`/campaigns/${campaign_id}`);
  redirect(`/campaigns/${campaign_id}`);
}

// create dashboard for character
export async function createCharacterDashboard(dashboardID: string, campaign_id: string, character_id: string | null, characterName: string) {
  const newDashboardId = nanoid(10);
  try {
    let numDashboards = await fetchDashboardNumber(campaign_id, character_id);
    numDashboards++;
    const originalDashboard = await prisma.dashboard.findUnique({
      where: { dashboard_id: dashboardID },
    });

    if (!originalDashboard) throw new Error('Dashboard not found');

    await prisma.dashboard.create({
      data: {
        dashboard_id: newDashboardId,
        campaign_id,
        character_id,
        visibility: originalDashboard.visibility,
        name: `${characterName}-Dashboard-${numDashboards}`,
      },
    });
  } catch (e) {
    console.error('Failed to create dashboard:', e, "Input: \n", "Dashboard ID: ", dashboardID, "\n", "Campaign ID: ", campaign_id, "\n", "Character ID: ", character_id, "\n", "Character Name: ", characterName);
    return { message: 'Database Error: Failed to Create Dashboard.' };
  }
  revalidatePath(`/dashboard/${newDashboardId}`);
  redirect(`/dashboard/${newDashboardId}`);
}

export async function deleteDashboardByDashboardID(dashboard_id: string, campaignId: string) {
  try {
    await prisma.dashboard.delete({
      where: { dashboard_id },
    });
  } catch (e) {
    console.error('Failed to delete dashboard:', e, "Input: \n", "Dashboard ID: ", dashboard_id, "\n", "Campaign ID: ", campaignId);
    return { message: 'Database Error: Failed to Delete Dashboard.' };
  }
  revalidatePath('/campaigns/' + campaignId);
  redirect('/campaigns/' + campaignId);
}

// update dashboard layout
export async function updateDashboardLayout(dashboard_id: string, layout: any) {
  try {
    // used for deleting elements that are removed from the layout
    const existingElements = await prisma.dashboardElement.findMany({
      where: { dashboard_id },
      select: { element_id: true },
    });

    let existingElementIds = existingElements.map((el) => el.element_id);



    let dashboardElements: DashboardElement[] = [];
    for (const breakpoint in layout) {
      if (layout.hasOwnProperty(breakpoint)) {
        for (const element of layout[breakpoint]) {
          const { w, h, x, y, i } = element;

          let [id, element_type, character_id] = i.split(',');

          if (id.startsWith('00000000')) {
            id = nanoid(10);
          }

          let dashboardElement = dashboardElements.find(
            (el) => el.element_id === id && el.element_type === element_type && el.character_id === character_id
          );

          if (!dashboardElement) {
            dashboardElement = {
              element_id: id,
              dashboard_id,
              character_id,
              element_type,
              x_lg: 0, y_lg: 0, w_lg: 1, h_lg: 1,
              x_md: null, y_md: null, w_md: null, h_md: null,
              x_sm: null, y_sm: null, w_sm: null, h_sm: null,
              x_xs: null, y_xs: null, w_xs: null, h_xs: null,
              x_xxs: null, y_xxs: null, w_xxs: null, h_xxs: null,
            };
            dashboardElements.push(dashboardElement);
          }

          switch (breakpoint) {
            case 'lg':
              Object.assign(dashboardElement, { x_lg: x, y_lg: y, w_lg: w, h_lg: h });
              existingElementIds = existingElementIds.filter((eid) => eid !== id);
              break;
            case 'md':
              Object.assign(dashboardElement, { x_md: x, y_md: y, w_md: w, h_md: h });
              break;
            case 'sm':
              Object.assign(dashboardElement, { x_sm: x, y_sm: y, w_sm: w, h_sm: h });
              break;
            case 'xs':
              Object.assign(dashboardElement, { x_xs: x, y_xs: y, w_xs: w, h_xs: h });
              break;
            case 'xxs':
              Object.assign(dashboardElement, { x_xxs: x, y_xxs: y, w_xxs: w, h_xxs: h });
              break;
          }
        }
      }
    }

    await Promise.all(
      dashboardElements.map((element) =>
        prisma.dashboardElement.upsert({
          where: {
            dashboard_id_character_id_element_type: {
              dashboard_id: element.dashboard_id,
              character_id: element.character_id,
              element_type: element.element_type,
            },
          },
          update: element,
          create: element,
        })
      )
    );

    // Remove elements no longer in the layout
    if (existingElementIds.length > 0) {
      await prisma.dashboardElement.deleteMany({
        where: { element_id: { in: existingElementIds } },
      });
    }
  } catch (e) {
    console.error('Failed to update dashboard layout:', e, "Input: \n", "Dashboard ID: ", dashboard_id, "\n", "Layout: ", layout);
    return { message: 'Database Error: Failed to Update Dashboard Layout.' };
  }

  revalidatePath(`/dashboard/${dashboard_id}`);
  redirect(`/dashboard/${dashboard_id}`);
}

// Create dashboard element
export async function createDashboardElement(dashboardId: string, formData: FormData) {
  console.log('Creating dashboard element');
  const elementId = nanoid(10);
  const character_id = z.string().parse(formData.get('character'));
  const element_type = z.string().parse(formData.get('element'));

  try {
    // Check if the element already exists
    const existingElement = await prisma.dashboardElement.findFirst({
      where: {
        dashboard_id: dashboardId,
        character_id,
        element_type,
      },
    });

    if (existingElement) {
      console.error('Element already exists');
      return 'Element already exists';
    }

    await prisma.dashboardElement.create({
      data: {
        element_id: elementId,
        dashboard_id: dashboardId,
        character_id,
        element_type,
        x_lg: 9,
        y_lg: 9999,
        w_lg: 3,
        h_lg: 2,
      },
    });
  } catch (e) {
    console.error('Failed to create dashboard element:', e);
    return 'Database Error: Failed to Create Dashboard Element.';
  }

  revalidatePath(`/dashboard/${dashboardId}`);
  redirect(`/dashboard/${dashboardId}`);
}