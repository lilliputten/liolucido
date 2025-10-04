import { TAllowedUser } from '../types';
import { compareAllowedUsers } from './compareAllowedUsers';

export function findSelectedUserIdx(selectedUsers: TAllowedUser[] | undefined, user: TAllowedUser) {
  return selectedUsers ? selectedUsers.findIndex((u) => compareAllowedUsers(u, user)) : -1;
}
