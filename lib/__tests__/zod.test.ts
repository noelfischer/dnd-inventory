import { describe, expect, it } from "vitest";
import { signInSchema } from "../zod";

describe("signInSchema", () => {
  it("accepts valid credentials", () => {
    const parsed = signInSchema.parse({
      email: "player@example.com",
      password: "hunter22",
    });

    expect(parsed.email).toBe("player@example.com");
    expect(parsed.password).toBe("hunter22");
  });

  it("rejects invalid email", () => {
    expect(() =>
      signInSchema.parse({
        email: "not-an-email",
        password: "hunter22",
      }),
    ).toThrow("Invalid email");
  });

  it("rejects short password", () => {
    expect(() =>
      signInSchema.parse({
        email: "player@example.com",
        password: "12345",
      }),
    ).toThrow("Password must be more than 6 characters");
  });

  it("rejects password longer than 32 characters", () => {
    expect(() =>
      signInSchema.parse({
        email: "player@example.com",
        password: "123456789012345678901234567890123",
      }),
    ).toThrow("Password must be less than 32 characters");
  });
});
