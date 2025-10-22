'use server';

import { Prisma } from '@prisma/client';

import { getUser } from '../actions/getUser';

export interface TCheckIfUserExistsParams {
  id: string;
  doThrow?: boolean;
  include?: Prisma.UserInclude;
}

export async function checkIfUserExists(params: TCheckIfUserExistsParams) {
  const { id, doThrow, include } = params;
  // Verify user exists
  const user = await getUser({ where: { id }, include });
  if (user) {
    return user;
  }
  if (doThrow) {
    throw new Error(`User with ID ${id} does not exist.`);
  }
  return undefined;
}
