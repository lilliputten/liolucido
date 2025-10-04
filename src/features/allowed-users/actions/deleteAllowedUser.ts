'use server';

import { prisma } from '@/lib/db';
import { DatabaseError } from '@/lib/errors';
import { getErrorText } from '@/lib/helpers';
import { isDev } from '@/config';

import { TAllowedUser, TAllowedUserId } from '../types';

export async function deleteAllowedUser(id: TAllowedUserId) {
  if (isDev) {
    // DEBUG: Emulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  try {
    const deletedUser = await prisma.allowedUser.delete({
      where: {
        id,
      },
    });
    return deletedUser as TAllowedUser;
  } catch (error) {
    const nextMessage = ['Deleting allowed user error', getErrorText(error)]
      .filter(Boolean)
      .join(': ');
    const nextError = new DatabaseError(nextMessage);
    // eslint-disable-next-line no-console
    console.warn('[deleteAllowedUser]', nextMessage, {
      nextError,
      error,
    });
    debugger; // eslint-disable-line no-debugger
    // NOTE: Re-throw an error?
    throw nextError;
  }
}
