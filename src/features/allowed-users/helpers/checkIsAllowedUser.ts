import { AdapterUser } from '@auth/core/adapters';
import { Account, Profile, User } from '@auth/core/types';

import { USE_ALLOWED_USERS } from '@/config/envServer';

import { getAllAllowedEmails, getAllAllowedTelegramIds } from '../actions';
import { TUserRejectReason } from '../types/TUserRejectReason';

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
    const tgId = Number(providerAccountId);
    if (!tgId) {
      return 'NO_TELEGRAM_ID';
    }
    const tgIds = await getAllAllowedTelegramIds();
    if (!tgIds.includes(tgId)) {
      return 'REJECTED_TELEGRAM_ID';
    }
    return undefined;
  }

  // Check for valid email
  const userEmail = user.email;
  const profileEmail = profile?.email;
  const email = userEmail || profileEmail;

  const validEmails = await getAllAllowedEmails();
  if (!email) {
    return 'NO_EMAIL';
  }
  if (!validEmails.includes(email)) {
    return 'REJECTED_EMAIL';
  }

  return undefined;
}
