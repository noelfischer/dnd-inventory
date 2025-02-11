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


// ACTIONS and Placement could be imported from react-joyride, but since we can't use the library server-side, we'll define them here
export const ACTIONS = {
  INIT: "init", START: "start", STOP: "stop", RESET: "reset", PREV: "prev", NEXT: "next", GO: "go", CLOSE: "close", SKIP: "skip", UPDATE: "update"
}

export type Placement = "top-end" | "top" | "top-start" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end" | "right" | "right-start" | "right-end"
