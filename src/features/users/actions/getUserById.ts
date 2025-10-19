import { Prisma } from '@prisma/client';

import { TDefinedUserId } from '../types/TUser';
import { getUser } from './getUser';

export async function getUserById(id: TDefinedUserId, include?: Prisma.UserInclude) {
  return await getUser({ where: { id }, include });
}
