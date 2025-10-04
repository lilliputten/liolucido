import { TAllowedUser } from '../types';

export function compareAllowedUsers(u1: TAllowedUser, u2: TAllowedUser) {
  if (!u1 || !u2) {
    return false;
  }
  return u1.type === u2.type && u1.value === u2.value;
}
