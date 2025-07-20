import { prisma } from '@/lib/db';

import { TDefinedUserId } from '../types/TUser';

export async function getUserById(id: TDefinedUserId) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch {
    return null;
  }
}
