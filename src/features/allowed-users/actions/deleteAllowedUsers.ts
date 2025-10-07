'use server';

import { prisma } from '@/lib/db';
import { DatabaseError } from '@/lib/errors';
import { getErrorText } from '@/lib/helpers';
import { isDev } from '@/config';

import { TAllowedUserId } from '../types';

export async function deleteAllowedUsers(ids: TAllowedUserId[]) {
  if (isDev) {
    // DEBUG: Emulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  try {
    const result = await prisma.allowedUser.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    return result;
  } catch (error) {
    const nextMessage = ['Deleting allowed users error', getErrorText(error)]
      .filter(Boolean)
      .join(': ');
    const nextError = new DatabaseError(nextMessage);
    // eslint-disable-next-line no-console
    console.warn('[deleteAllowedUsers]', nextMessage, {
      nextError,
      error,
    });
    debugger; // eslint-disable-line no-debugger
    // NOTE: Re-throw an error?
    throw nextError;
  }
}
