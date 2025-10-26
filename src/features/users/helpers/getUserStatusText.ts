import { TUser } from '@/features/users/types';

export function getUserStatusText(user?: TUser) {
  const isLogged = !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isPro = user?.grade === 'PRO';
  if (isAdmin) {
    return 'an administrator';
  }
  if (isPro) {
    return 'a PRO user';
  }
  if (isLogged) {
    return 'a logged user';
  }
  return 'a guest user';
}
