import { ExtendedUser } from '@/@types/next-auth';

// import { User as PrismaUser } from '@/generated/prisma';

export type TUser = ExtendedUser;

export type TUserId = TUser['id'];
