import { useSession } from 'next-auth/react';

import { TUser } from '@/features/users/types/TUser';

/** Client: Get user from client session.
 * Use `getCurrentUser` fro server components.
 */
export function useSessionUser() {
  const session = useSession();
  const user: TUser | undefined = session.data?.user;
  return user;
}
