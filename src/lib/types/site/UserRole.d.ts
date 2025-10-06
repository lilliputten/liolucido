// NOTE: We don't use prisma enum `UserRole` as it's not supported for sqlite
// import { UserRole } from '@/generated/prisma';

type UserRole = 'USER' | 'ADMIN';
