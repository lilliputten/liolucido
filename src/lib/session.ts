// This file should only be used in server components
'use server';

import { cache } from 'react';

import { auth } from '@/auth';
import {
  checkIfUserExists,
  TCheckIfUserExistsParams,
} from '@/features/users/actions/checkIfUserExists';
import { TExtendedUser } from '@/features/users/types/TUser';

import { UserRoles } from './db/TUserRole';

type TParams = Omit<TCheckIfUserExistsParams, 'id'>;

export const getCurrentUser = cache<(params?: TParams) => Promise<TExtendedUser | undefined>>(
  async (params: TParams = {}) => {
    const session = await auth();
    const user = session?.user;
    const id = user?.id;
    if (!id) {
      return undefined;
    }
    // TODO: Check also if the user really exists in the database>
    return await checkIfUserExists({ ...params, id });
  },
);

export async function isLoggedUser() {
  const user = await getCurrentUser();
  return !!user;
}

export async function isAdminUser() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === UserRoles.ADMIN;
  return isAdmin;
}
