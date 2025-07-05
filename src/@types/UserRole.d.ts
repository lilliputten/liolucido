// NOTE: We don't use prisma enum `UserRole` as it's not supported for sqlite
// import { UserRole } from '@prisma/client';

type UserRole = 'USER' | 'ADMIN';
