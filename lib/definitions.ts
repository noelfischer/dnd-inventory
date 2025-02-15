// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

import { z } from "zod";

export type SimpleCharacter = {
  character_id: string;
  name: string;
  current_hit_points: number;
  max_hit_points: number;
  character_type: string;
};

export type DashboardWithCharacterType = {
  name: string;
  dashboard_id: string;
  character_id: string;
  character_type: string;
};


// ACTIONS and Placement could be imported from react-joyride, but since we can't use the library server-side, we'll define them here
export const ACTIONS = {
  INIT: "init", START: "start", STOP: "stop", RESET: "reset", PREV: "prev", NEXT: "next", GO: "go", CLOSE: "close", SKIP: "skip", UPDATE: "update"
}

export type Placement = "top-end" | "top" | "top-start" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end" | "right" | "right-start" | "right-end"

const parseNumber = (val: any) => {
  if (typeof val === 'string') {
    if (val === '') return 0;
    const parsed = parseInt(val);
    if (isNaN(parsed)) throw new Error(`Invalid number: ${val}`);
    return parsed;
  }
  return val;
};


export const CharacterSchema = z.object({
  user_id: z.string().length(10),
  name: z.string().max(100),
  description: z.string().max(200),
  character_type: z.string().max(50),
  species: z.string().max(50).optional(),
  cclass: z.string().length(2),
  level: z.preprocess(parseNumber, z.number()),
  portrait_url: z.string().max(500),
  strength: z.preprocess(parseNumber, z.number()),
  dexterity: z.preprocess(parseNumber, z.number()),
  constitution: z.preprocess(parseNumber, z.number()),
  intelligence: z.preprocess(parseNumber, z.number()),
  wisdom: z.preprocess(parseNumber, z.number()),
  charisma: z.preprocess(parseNumber, z.number()),
  max_hit_points: z.preprocess(parseNumber, z.number()),
  armor_class: z.preprocess(parseNumber, z.number()),
});


export const ExportCharacterSchema = z.object({
  name: z.string().max(100),
  description: z.string().max(200),
  character_type: z.string().max(50),
  species: z.string().max(50).optional(),
  cclass: z.string().length(2),
  level: z.preprocess(parseNumber, z.number()),
  portrait_url: z.string().max(500),
  strength: z.preprocess(parseNumber, z.number()),
  dexterity: z.preprocess(parseNumber, z.number()),
  constitution: z.preprocess(parseNumber, z.number()),
  intelligence: z.preprocess(parseNumber, z.number()),
  wisdom: z.preprocess(parseNumber, z.number()),
  charisma: z.preprocess(parseNumber, z.number()),
  max_hit_points: z.preprocess(parseNumber, z.number()),
  current_hit_points: z.preprocess(parseNumber, z.number()),
  temp_hit_points: z.preprocess(parseNumber, z.number()),
  load_capacity: z.preprocess(parseNumber, z.number()),
  backpack_capacity: z.preprocess(parseNumber, z.number()),
  armor_class: z.preprocess(parseNumber, z.number()),
  Inventory: z.array(z.object({
    i: z.preprocess(parseNumber, z.number()),
    slot: z.string().max(10),
    name: z.string().max(50),
    description: z.string().max(200),
    category: z.string().max(50),
    weight: z.preprocess(parseNumber, z.number()),
    quantity: z.preprocess(parseNumber, z.number()),
    magic: z.boolean(),
  })),
  Currency: z.object({
    platinum: z.preprocess(parseNumber, z.number()),
    gold: z.preprocess(parseNumber, z.number()),
    silver: z.preprocess(parseNumber, z.number()),
    copper: z.preprocess(parseNumber, z.number()),
  }),
  CharacterInfo: z.object({
    abilities: z.string().max(1000),
    conditions: z.string().max(1000),
    notes: z.string().max(1000),
  }),
  SpellSlot: z.array(z.object({
    level: z.preprocess(parseNumber, z.number()),
    total_casts: z.preprocess(parseNumber, z.number()),
    casts_remaining: z.preprocess(parseNumber, z.number()),
  }))
});

export type ExportCharacter = z.infer<typeof ExportCharacterSchema>;