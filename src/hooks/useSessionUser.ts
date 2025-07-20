import { useSession } from 'next-auth/react';

import { TExtendedUser } from '@/features/users/types/TUser';

/** Client: Get user from client session.
 * Use `getCurrentUser` fro server components.
 */
export function useSessionUser(): TExtendedUser | undefined {
  const session = useSession();
  return session?.data?.user;
}
