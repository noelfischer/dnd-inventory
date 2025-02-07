// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

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