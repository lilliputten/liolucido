'use server';

import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/db';
import { DatabaseError } from '@/lib/errors';
import { getErrorText } from '@/lib/helpers';
import { TGetAllowedUserResults } from '@/lib/zod-schemas';
import { isDev } from '@/config';

import { TAllowedUser } from '../types';

export async function getAllowedUsersResults(args: Prisma.AllowedUserFindManyArgs = {}) {
  if (isDev) {
    // DEBUG: Emulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  try {
    const where = args.where || {};
    const [items, totalCount] = await prisma.$transaction([
      prisma.allowedUser.findMany(args),
      prisma.allowedUser.count({ where }),
    ]);
    return { items: items as TAllowedUser[], totalCount } satisfies TGetAllowedUserResults;
  } catch (error) {
    const nextMessage = ['Allowed users results fetching error', getErrorText(error)]
      .filter(Boolean)
      .join(': ');
    const nextError = new DatabaseError(nextMessage);
    // eslint-disable-next-line no-console
    console.warn('[getAllowedUsersResults]', nextMessage, {
      args,
      nextError,
      error,
    });
    debugger; // eslint-disable-line no-debugger
    // NOTE: Re-throw an error?
    throw nextError;
  }
}
