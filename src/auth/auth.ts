import { AuthConfig } from '@auth/core';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

import { prisma } from '@/lib/db';
import { isDev } from '@/constants';
import { getUserById } from '@/features/users/actions/';
import { TExtendedUser } from '@/features/users/types/TUser';

import authConfig from './auth.config';

export const nextAuthApp = NextAuth({
  debug: false && isDev,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    // @see https://next-auth.js.org/configuration/pages
    // signIn: '/login', // TODO: Add login page (see examples in `wordwizzz-saas` project)
    // error: "/auth/error",
  },
  callbacks: {
    async signIn(_params) {
      /* // Got params for 'telegram` here:
       * {
       *   "user": {
       *     "id": "490398083",
       *     "email": "490398083",
       *     "name": "Ig ",
       *     "image": "https://t.me/i/userpic/320/3meBKT_rsGqbt3HOAqNHdAIWEQYHGeW3m86yeYhZiUo.jpg"
       *   },
       *   "account": {
       *     "providerAccountId": "490398083",
       *     "type": "credentials",
       *     "provider": "telegram-auth"
       *   },
       *   "credentials": {
       *     "csrfToken": "ac76870b50b256c123f85ff1a5bf46dac39f9c2b74c1a57cfa9bc852d3740688",
       *     "callbackUrl": "/data"
       *   }
       * }
       */
      /*
       * const { user, account, profile, email, credentials } = _params;
       * console.log('[auth:callbacks:signIn]', {
       *   user,
       *   account,
       *   profile,
       *   email,
       *   credentials,
       * });
       */
      return true;
    },
    async session(params) {
      const { token, session } = params;
      /* console.log('[auth:callbacks:session]', {
       *   token,
       *   session,
       *   params,
       * });
       */
      const user = session.user as unknown as TExtendedUser;
      if (user) {
        if (token.sub) {
          user.id = token.sub;
          // It uses tg user id for telegram login
        }
        if (token.email) {
          user.email = token.email;
        }
        if (token.role) {
          // @see JWT type extension in `@types/next-auth.d.ts`
          user.role = token.role as UserRole;
        }
        user.name = token.name;
        user.image = token.picture;
      }
      return session;
    },
    async jwt(params) {
      const token = params.token as JWT;
      // const { token } = params;
      /* // Values for telegram login:
       * {
       *   "token": {
       *     "name": "Ig ",
       *     "email": "490398083",
       *     "picture": "https://t.me/i/userpic/320/3meBKT_rsGqbt3HOAqNHdAIWEQYHGeW3m86yeYhZiUo.jpg",
       *     "sub": "490398083"
       *   },
       *   "user": {
       *     "id": "490398083",
       *     "email": "490398083",
       *     "name": "Ig ",
       *     "image": "https://t.me/i/userpic/320/3meBKT_rsGqbt3HOAqNHdAIWEQYHGeW3m86yeYhZiUo.jpg"
       *   },
       *   "account": {
       *     "providerAccountId": "490398083",
       *     "type": "credentials",
       *     "provider": "telegram-auth"
       *   },
       *   "isNewUser": false,
       *   "trigger": "signIn"
       * }
       */
      /* console.log('[auth:callbacks:jwt]', {
       *   token,
       *   params,
       * });
       */
      if (!token.sub) {
        return token;
      }
      const dbUser = await getUserById(token.sub);
      if (!dbUser) {
        return token;
      }
      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      token.role = dbUser.role;
      /* console.log('[auth:callbacks:jwt] Updated token', {
       *   token,
       *   params,
       * });
       */
      return token;
    },
  } satisfies AuthConfig['callbacks'],
  ...authConfig,
});

export const {
  handlers: { GET, POST },
  auth,
} = nextAuthApp;
