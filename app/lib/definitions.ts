// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  user_id: string;
  username: string;
  password_hash: string;
  email: string;
  created_at: string;
};

export type Campaign = {
  campaign_id: string;
  name: string;
  description: string;
  password: string;
  dm_id: string;
  created_at: string;
};

export type CampaignUser = {
  campaign_user_id: string;
  campaign_id: string;
  user_id: string;
  username: string;
  created_at: string;
};

export type Character = {
  character_id: string;
  campaign_id: string;
  user_id: string;
  name: string;
  description: string;
  character_type: string;
  race: string;
  class: string;
  level: number;
  background: string;
  alignment: string;
  portrait_url: string;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  max_hit_points: number;
  current_hit_points: number;
  temp_hit_points: number;
  armor_class: number;
  speed: number;
  initiative: number;
  death_saves_success: number;
  death_saves_failure: number;
  experience_points: number;
  created_at: string;
  updated_at: string;
};

export type SimpleCharacter = {
  character_id: string;
  user_id: string;
  name: string;
  character_type: string;
};

export type Skill = {
  skill_id: string;
  character_id: string;
  skill_name: string;
  proficiency: boolean;
};

export type InventoryItem = {
  item_id: string;
  character_id: string;
  inventory_name: string;
  item_name: string;
  description: string;
  ability: string;
  weight: number;
  category: string;
  magic: boolean;
  quantity: number;
};

export type Currency = {
  currency_id: string;
  character_id: string;
  platin: number;
  gold: number;
  silver: number;
  copper: number;
};

export type UserSpell = {
  user_spell_id: string;
  character_id: string;
  spell_id: string;
  prepared: boolean;
  slots_total: number;
  slots_used: number;
};

export type GeneralSpell = {
  spell_id: string;
  spell_name: string;
  description: string;
  spell_level: number;
};

export type Ability = {
  ability_id: string;
  character_id: string;
  ability_name: string;
  description: string;
};

export type Condition = {
  condition_id: string;
  character_id: string;
  condition_name: string;
  duration: number;
  impact: string;
};

export type Dashboard = {
  dashboard_id: string;
  campaign_id: string;
  character_id: string;
  visibility: string;
  name: string;
  columns: number;
  rows: number;
  created_at: string;
};

export type DashboardElement = {
  element_id: string;
  dashboard_id: string;
  element_type: string;
  position_x: number;
  position_y: number;
  size_x: number;
  size_y: number;
  created_at: string;
};
