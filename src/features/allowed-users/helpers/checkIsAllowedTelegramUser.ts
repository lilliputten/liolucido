'use server';

import { USE_ALLOWED_USERS } from '@/config/envServer';

import { getAllAllowedTelegramIds } from '../actions';
import { TUserRejectReason } from '../types/TUserRejectReason';

/** Returns rejection reason. OK = undefined. */
export async function checkIsAllowedTelegramUser(
  providerAccountId?: number | string,
): Promise<TUserRejectReason | undefined> {
  if (!USE_ALLOWED_USERS) {
    return undefined;
  }

  // Check ids for telegram provider
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
