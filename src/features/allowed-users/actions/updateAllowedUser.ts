'use server';

import { prisma } from '@/lib/db';
import { DatabaseError } from '@/lib/errors';
import { getErrorText } from '@/lib/helpers';
import { isDev } from '@/config';

import { TAllowedUser } from '../types';

export async function updateAllowedUser(user: TAllowedUser) {
  if (isDev) {
    // DEBUG: Emulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  try {
    const addedUser = await prisma.allowedUser.update({
      where: {
        id: user.id,
      },
      data: user,
    });
    return addedUser as TAllowedUser;
  } catch (error) {
    const nextMessage = ['Updating allowed user error', getErrorText(error)]
      .filter(Boolean)
      .join(': ');
    const nextError = new DatabaseError(nextMessage);
    // eslint-disable-next-line no-console
    console.warn('[updateAllowedUser]', nextMessage, {
      nextError,
      error,
    });
    debugger; // eslint-disable-line no-debugger
    // NOTE: Re-throw an error?
    throw nextError;
  }
}
