'use server';

import { getAllowedUsers } from '@/features/allowed-users/actions/getAllowedUsers';
import { AllowedUserTypes } from '@/features/allowed-users/types/AllowedUserType';

export async function getAllAllowedEmails() {
  const allowedUsers = await getAllowedUsers({ where: { type: AllowedUserTypes.email } });
  return allowedUsers.map(({ value }) => value);
}
