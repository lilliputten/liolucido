'use server';

import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import { DatabaseError } from '@/lib/errors';
import { getErrorText } from '@/lib/helpers';

export async function getAllowedUsers(args: Prisma.AllowedUserFindManyArgs = {}) {
  try {
    const allowedUsers = await prisma.allowedUser.findMany(args);
    return allowedUsers;
  } catch (error) {
    const nextMessage = ['Allowed users fetching error', getErrorText(error)]
      .filter(Boolean)
      .join(': ');
    const nextError = new DatabaseError(nextMessage);
    // eslint-disable-next-line no-console
    console.warn('[getAllowedUsers]', nextMessage, {
      nextError,
      error,
    });
    debugger; // eslint-disable-line no-debugger
    // NOTE: Re-throw an error?
    throw nextError;
  }
}
