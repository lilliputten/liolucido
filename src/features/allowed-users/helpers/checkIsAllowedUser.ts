'use server';

import { AdapterUser } from '@auth/core/adapters';
import { Account, Profile, User } from '@auth/core/types';

import { USE_ALLOWED_USERS } from '@/config/envServer';

import { TUserRejectReason } from '../types/TUserRejectReason';
import { checkIsAllowedEmail } from './checkIsAllowedEmail';
import { checkIsAllowedTelegramUser } from './checkIsAllowedTelegramUser';

// see object paramater in the `signIn` handler in the `src/auth/auth.ts` module
type TCheckIsAllowedUser = {
  user: AdapterUser | User;
  account?: Account | null;
  profile?: Profile;
  // credentials?: Record<string, CredentialInput>;
};

/** Returns rejection reason. OK = undefined. */
export async function checkIsAllowedUser(
  params: TCheckIsAllowedUser,
): Promise<TUserRejectReason | undefined> {
  const {
    user,
    account,
    profile,
    // credentials,
  } = params;
  const { provider, providerAccountId } = account || {};

  if (!USE_ALLOWED_USERS) {
    return undefined;
  }

  // TODO: Also check for blocked users

  // Check ids for telegram provider
  if (provider === 'telegram') {
    return await checkIsAllowedTelegramUser(providerAccountId);
  }

  // Check for valid email
  const userEmail = user.email;
  const profileEmail = profile?.email;
  const email = userEmail || profileEmail || undefined;

  return checkIsAllowedEmail(email);
}
