import { describe, expect, it } from "vitest";
import { CharacterSchema, ExportCharacterSchema } from "../definitions";

function buildCharacterInput(overrides: Record<string, unknown> = {}) {
  return {
    user_id: "ABCDEFGHIJ",
    name: "Aria",
    description: "Wizard",
    character_type: "Player",
    species: "Elf",
    cclass: "ma",
    level: "3",
    portrait_url: "https://example.com/aria.png",
    strength: "8",
    dexterity: "14",
    constitution: "12",
    intelligence: "16",
    wisdom: "10",
    charisma: "11",
    max_hit_points: "20",
    armor_class: "13",
    ...overrides,
  };
}

describe("CharacterSchema", () => {
  it("coerces numeric form fields from strings", () => {
    const parsed = CharacterSchema.parse(buildCharacterInput());

    expect(parsed.level).toBe(3);
    expect(parsed.intelligence).toBe(16);
    expect(parsed.max_hit_points).toBe(20);
  });

  it("maps empty numeric strings to 0", () => {
    const parsed = CharacterSchema.parse(
      buildCharacterInput({
        level: "",
        strength: "",
      }),
    );

    expect(parsed.level).toBe(0);
    expect(parsed.strength).toBe(0);
  });

  it("rejects invalid numeric values", () => {
    expect(() =>
      CharacterSchema.parse(
        buildCharacterInput({
          dexterity: "not-a-number",
        }),
      ),
    ).toThrow("Invalid number: not-a-number");
  });
});

describe("ExportCharacterSchema", () => {
  it("coerces nested numeric values for export payloads", () => {
    const parsed = ExportCharacterSchema.parse({
      name: "Aria",
      description: "Wizard",
      character_type: "Player",
      species: "Elf",
      cclass: "ma",
      level: "3",
      portrait_url: "https://example.com/aria.png",
      strength: "8",
      dexterity: "14",
      constitution: "12",
      intelligence: "16",
      wisdom: "10",
      charisma: "11",
      max_hit_points: "20",
      current_hit_points: "12",
      temp_hit_points: "0",
      load_capacity: "120",
      backpack_capacity: "60",
      armor_class: "13",
      Inventory: [
        {
          i: "0",
          slot: "bag",
          name: "Spellbook",
          description: "Arcane notes",
          category: "tool",
          weight: "3",
          quantity: "1",
          magic: false,
        },
      ],
      Currency: {
        platinum: "1",
        gold: "50",
        silver: "0",
        copper: "0",
      },
      CharacterInfo: {
        abilities: "Arcana",
        conditions: "",
        notes: "",
      },
      SpellSlot: [
        {
          level: "1",
          total_casts: "4",
          casts_remaining: "2",
        },
      ],
    });

    expect(parsed.Inventory[0].weight).toBe(3);
    expect(parsed.Currency.gold).toBe(50);
    expect(parsed.SpellSlot[0].total_casts).toBe(4);
  });
});
