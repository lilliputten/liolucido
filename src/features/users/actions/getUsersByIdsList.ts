'use server';

import { prisma } from '@/lib/db';

import { TDefinedUserId } from '../types/TUser';

export async function getUsersByIdsList(idsList: TDefinedUserId[]) {
  try {
    const users = await prisma.user.findMany({ where: { id: { in: idsList } } });
    return users;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[getUsersByIdsList] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
