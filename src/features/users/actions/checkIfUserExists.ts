'use server';

import { prisma } from '@/lib/db';

export async function checkIfUserExists(userId: string, doThrow?: boolean) {
  // Verify user exists
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (userExists) {
    return true;
  }
  if (doThrow) {
    throw new Error(`User with ID ${userId} does not exist.`);
  }
  return false;
}
