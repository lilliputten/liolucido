import { AllowedUserTypeSchema, AllowedUserTypeType } from '@/generated/prisma';

export const AllowedUserTypes: Record<AllowedUserTypeType, AllowedUserTypeType> = {
  EMAIL: 'EMAIL',
  TELEGRAM: 'TELEGRAM',
} as const;
export const allowedUserTypesList = AllowedUserTypeSchema.options; // Object.values(AllowedUserTypes);
export type TAllowedUserType = AllowedUserTypeType; // (typeof AllowedUserTypes)[keyof typeof AllowedUserTypes];
export const defaultAllowedUserType: TAllowedUserType = allowedUserTypesList[0]; // AllowedUserTypes.email;
export const coercedAllosedUserTypeZType = AllowedUserTypeSchema; // z.nativeEnum(AllowedUserTypeEnum);
