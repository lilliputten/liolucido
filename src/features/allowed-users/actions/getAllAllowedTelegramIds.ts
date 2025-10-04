'use server';

import { getAllowedUsers } from '@/features/allowed-users/actions/getAllowedUsers';
import { AllowedUserTypes } from '@/features/allowed-users/types/AllowedUserType';

export async function getAllAllowedTelegramIds() {
  const allowedUsers = await getAllowedUsers({ where: { type: AllowedUserTypes.telegram } });
  return allowedUsers.map(({ value }) => Number(value));
}
