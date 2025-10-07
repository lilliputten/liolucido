import * as z from 'zod';

export const AllowedUserTypes = {
  email: 'EMAIL',
  telegram: 'TELEGRAM',
} as const;
export const allowedUserTypesList = Object.values(AllowedUserTypes);
export type TAllowedUserType = (typeof AllowedUserTypes)[keyof typeof AllowedUserTypes];
export const defaultAllowedUserType: TAllowedUserType = AllowedUserTypes.email;

export const AllowedUserTypeEnum = allowedUserTypesList.reduce(
  (acc, type) => {
    acc[type] = type;
    return acc;
  },
  {} as Record<TAllowedUserType, TAllowedUserType>,
);
export const coercedAllosedUserTypeZType = z.nativeEnum(AllowedUserTypeEnum);
