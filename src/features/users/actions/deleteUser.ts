'use server';

import { DatabaseError } from '@/shared/types/errors';
import { prisma } from '@/lib/db';
import { getErrorText } from '@/lib/helpers/strings';

import { TDefinedUserId } from '../types/TUser';

export type TDeleteUserAction = typeof deleteUser;

export async function deleteUser(userId: TDefinedUserId) {
  try {
    // NOTE: Related records will be deleted as they're cascaded
    const removedUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return removedUser;
  } catch (error) {
    const nextText = 'Error deleting user';
    const errorMessage = getErrorText(error);
    const nextMessage = [nextText, errorMessage].filter(Boolean).join(': ');
    const nextError = new DatabaseError(nextMessage);
    // eslint-disable-next-line no-console
    console.error('[deleteUser]', nextMessage, {
      nextError,
      errorMessage,
      error,
    });
    debugger; // eslint-disable-line no-debugger
    // NOTE: Re-throw an error
    throw nextError;
  }
}
