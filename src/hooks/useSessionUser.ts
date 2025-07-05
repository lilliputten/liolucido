import { useSession } from 'next-auth/react';

import { TOptionalExtendedUser } from '@/features/users/types/TUser';

/** Client: Get user from client session.
 * Use `getCurrentUser` fro server components.
 */
export function useSessionUser(): TOptionalExtendedUser {
  const session = useSession();
  return session?.data?.user;
}
