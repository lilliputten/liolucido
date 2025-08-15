// NOTE: We don't use prisma enum `UserRole` as it's not supported for sqlite
// import { UserRole } from '@/generated/prisma';

export type TUserRole = UserRole;

export enum TUserRolesEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export const UserRoles: Record<TUserRole, TUserRole> = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};
