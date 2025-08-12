import { User as SessionUser } from 'next-auth';

import { User } from '@/generated/prisma';

export type TUser = User;
export type TSessionUser = SessionUser;

// export type TOptionalUserId = User['id'];
// export type TOptionalUserId = NonNullable<TOptionalUserId>;
export type TDefinedUserId = TUser['id'];
export type TOptionalUserId = TDefinedUserId | null;

export type TExtendedUser = {
  // @see src/@types/next-auth.d.ts
  role: UserRole;
  // provider?: string; // XXX: In addition to Account?
  // providerAccountId?: string; // XXX: In addition to Account?
} & TSessionUser;

export type TOptionalExtendedUser = TExtendedUser | undefined;
