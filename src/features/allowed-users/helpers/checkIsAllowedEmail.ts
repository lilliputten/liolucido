'use server';

import { USE_ALLOWED_USERS } from '@/config/envServer';

import { getAllAllowedEmails } from '../actions';
import { TUserRejectReason } from '../types/TUserRejectReason';

/** Returns rejection reason. OK = undefined. */
export async function checkIsAllowedEmail(email?: string): Promise<TUserRejectReason | undefined> {
  if (!USE_ALLOWED_USERS) {
    return undefined;
  }
  const validEmails = await getAllAllowedEmails();
  if (!email) {
    return 'NO_EMAIL';
  }
  if (!validEmails.includes(email)) {
    return 'REJECTED_EMAIL';
  }

  return undefined;
}
