import { User as AuthUser } from 'next-auth';
// NOTE: False-positive eslint error for extending existed type (see below)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from 'next-auth/jwt';

import { User as PrismaUser, UserRoleType } from '@/generated/prisma';

export type ExtendedUser = AuthUser & PrismaUser;

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRoleType;
  }
}

// More info: https://authjs.dev/getting-started/typescript#module-augmentation
declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
