import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

const nextAuthFn = vi.fn();
const credentialsProviderFn = vi.fn();
const googleProvider = { id: "google", type: "oauth" };

const parseAsyncMock = vi.fn();
const getUserFromDbMock = vi.fn();
const validatePasswordMock = vi.fn();
const userFindUniqueMock = vi.fn();
const transactionMock = vi.fn();
const nanoidMock = vi.fn();

let capturedConfig: any;

vi.mock("next-auth", () => ({
    default: (config: unknown) => {
        capturedConfig = config;
        nextAuthFn(config);
        return {
            handlers: {},
            signIn: vi.fn(),
            signOut: vi.fn(),
            auth: vi.fn(),
        };
    },
}));

vi.mock("next-auth/providers/credentials", () => ({
    default: (config: unknown) => {
        credentialsProviderFn(config);
        return { id: "credentials", type: "credentials", ...(config as object) };
    },
}));

vi.mock("next-auth/providers/google", () => ({
    default: googleProvider,
}));

vi.mock("../zod", () => ({
    signInSchema: {
        parseAsync: (...args: unknown[]) => parseAsyncMock(...args),
    },
}));

vi.mock("../utils", () => ({
    getUserFromDb: (...args: unknown[]) => getUserFromDbMock(...args),
    validatePassword: (...args: unknown[]) => validatePasswordMock(...args),
}));

vi.mock("../prisma", () => ({
    prisma: {
        user: {
            findUnique: (...args: unknown[]) => userFindUniqueMock(...args),
            create: vi.fn(),
        },
        account: {
            create: vi.fn(),
        },
        $transaction: (...args: unknown[]) => transactionMock(...args),
    },
}));

vi.mock("nanoid", () => ({
    nanoid: (...args: unknown[]) => nanoidMock(...args),
}));

describe("auth config", () => {
    beforeEach(() => {
        vi.resetModules();
        parseAsyncMock.mockReset();
        getUserFromDbMock.mockReset();
        validatePasswordMock.mockReset();
        userFindUniqueMock.mockReset();
        transactionMock.mockReset();
        nanoidMock.mockReset();
        capturedConfig = undefined;
    });

    async function loadConfig() {
        await import("../auth");
        return capturedConfig;
    }

    it("returns user for valid credentials", async () => {
        parseAsyncMock.mockResolvedValue({ email: "a@example.com", password: "secret123" });
        getUserFromDbMock.mockResolvedValue({
            id: "user-1",
            email: "a@example.com",
            Credential: [{ password_hash: "hash" }],
        });
        validatePasswordMock.mockResolvedValue(true);
        const config = await loadConfig();
        const credentialsProvider = config.providers.find((provider: any) => provider.id === "credentials");

        const result = await credentialsProvider.authorize({
            email: "a@example.com",
            password: "secret123",
        });

        expect(result.email).toBe("a@example.com");
    });

    it("returns null for invalid password", async () => {
        parseAsyncMock.mockResolvedValue({ email: "a@example.com", password: "wrongpass" });
        getUserFromDbMock.mockResolvedValue({
            id: "user-1",
            email: "a@example.com",
            Credential: [{ password_hash: "hash" }],
        });
        validatePasswordMock.mockResolvedValue(false);
        const config = await loadConfig();
        const credentialsProvider = config.providers.find((provider: any) => provider.id === "credentials");

        const result = await credentialsProvider.authorize({
            email: "a@example.com",
            password: "wrongpass",
        });

        expect(result).toBeNull();
    });

    it("returns null when schema validation fails", async () => {
        parseAsyncMock.mockRejectedValue(
            new ZodError([
                {
                    code: "custom",
                    path: ["email"],
                    message: "Invalid",
                },
            ]),
        );
        const config = await loadConfig();
        const credentialsProvider = config.providers.find((provider: any) => provider.id === "credentials");

        const result = await credentialsProvider.authorize({ email: "bad", password: "short" });
        expect(result).toBeNull();
    });

    it("creates user and account on first oauth sign in", async () => {
        userFindUniqueMock.mockResolvedValue(null);
        nanoidMock.mockReturnValue("generated-user-id");
        transactionMock.mockResolvedValue([]);
        const config = await loadConfig();

        const result = await config.callbacks.signIn({
            user: {
                id: "google-id",
                email: "oauth@example.com",
                name: "OAuth User",
                image: "https://example.com/pic.png",
            },
            account: {
                type: "oauth",
                provider: "google",
                providerAccountId: "google-id",
            },
        });

        expect(result).toBe(true);
        expect(userFindUniqueMock).toHaveBeenCalledWith({ where: { email: "oauth@example.com" } });
        expect(transactionMock).toHaveBeenCalledTimes(1);
    });

    it("does not create oauth records when user already exists", async () => {
        userFindUniqueMock.mockResolvedValue({ user_id: "existing-user" });
        const config = await loadConfig();

        await config.callbacks.signIn({
            user: {
                id: "google-id",
                email: "oauth@example.com",
                name: "OAuth User",
                image: "https://example.com/pic.png",
            },
            account: {
                type: "oauth",
                provider: "google",
                providerAccountId: "google-id",
            },
        });

        expect(transactionMock).not.toHaveBeenCalled();
    });

    it("authorized returns true when user is present", async () => {
        const config = await loadConfig();

        expect(config.callbacks.authorized({ auth: { user: { email: "player@example.com" } } })).toBe(true);
    });

    it("authorized returns false when auth is missing", async () => {
        const config = await loadConfig();

        expect(config.callbacks.authorized({ auth: null })).toBe(false);
    });
});
