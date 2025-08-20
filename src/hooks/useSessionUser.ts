import { ExtendedUser } from '@/@types/next-auth';
import { useSession } from 'next-auth/react';

/** Client: Get user from client session.
 * Use `getCurrentUser` fro server components.
 */
export function useSessionUser(): ExtendedUser | undefined {
  const session = useSession();
  return session?.data?.user;
}
