// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  user_id: number;
  username: string;
  password_hash: string;
  email: string;
  created_at: string;
};

export type Campaign = {
  campaign_id: number;
  name: string;
  description: string;
  dm_id: number;
  created_at: string;
};

export type Character = {
  character_id: number;
  campaign_id: number;
  user_id: number;
  name: string;
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
  death_saves_success: number;
  death_saves_failure: number;
  experience_points: number;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  skill_id: number;
  character_id: number;
  skill_name: string;
  proficiency: boolean;
};

export type InventoryItem = {
  item_id: number;
  character_id: number;
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
  currency_id: number;
  character_id: number;
  platin: number;
  gold: number;
  silver: number;
  copper: number;
};

export type UserSpell = {
  user_spell_id: number;
  character_id: number;
  spell_id: number;
  prepared: boolean;
  slots_total: number;
  slots_used: number;
};

export type GeneralSpell = {
  spell_id: number;
  spell_name: string;
  description: string;
  spell_level: number;
};

export type Ability = {
  ability_id: number;
  character_id: number;
  ability_name: string;
  description: string;
};

export type Condition = {
  condition_id: number;
  character_id: number;
  condition_name: string;
  duration: number;
  impact: string;
};

export type Dashboard = {
  dashboard_id: number;
  campaign_id: number;
  character_id: number;
  visibility: string;
  name: string;
  columns: number;
  rows: number;
  created_at: string;
};

export type DashboardElement = {
  element_id: number;
  dashboard_id: number;
  element_type: string;
  element_data: object;
  position_x: number;
  position_y: number;
  size_x: number;
  size_y: number;
  created_at: string;
};
