import NextAuth from "next-auth"
import { ZodError } from "zod"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./zod"
import { getUserFromDb, validatePassword } from "./utils"
import Google from "next-auth/providers/google";
import { prisma } from './prisma';
import { nanoid } from 'nanoid';

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    Google,
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      // @ts-ignore
      authorize: async (credentials) => {
        console.log("credentials", credentials)
        try {
          let user = null
          const { email, password } = await signInSchema.parseAsync(credentials)
          user = await getUserFromDb(email);

          if (!(await validatePassword(password, user?.Credential[0].password_hash))) {
            return null
          }
          console.log("user", user)
          // return JSON object with the user data
          return user
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null
          }
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("user", user);
      console.log("account", account);
      if (user && account && user.email && account.type !== "credentials") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          const newuserid = nanoid(10);
          await prisma.$transaction([
            prisma.user.create({
              data: {
                user_id: newuserid,
                username: user.name || user.email,
                email: user.email,
                picture: user.image,
              },
            }),
            prisma.account.create({
              data: {
                accountId: user.id || user.email,
                userId: newuserid,
                provider: account.provider,
                type: account.type,
                providerAccountId: account.providerAccountId,
              },
            }),
          ]);
        }
      }
      return true;
    },
    authorized({ auth }) {
      const isLoggedIn = !!auth?.user;
      return isLoggedIn;
    },
  }
})