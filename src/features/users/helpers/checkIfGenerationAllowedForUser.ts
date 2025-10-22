import { UserGradeType } from '@/generated/prisma';

import { TUser } from '../types/TUser';

const allowedGenerationForGrades: UserGradeType[] = ['BASIC', 'PRO'];

export function checkIfGenerationAllowedForUser(user?: TUser) {
  // return false; // DEBUG
  if (!user) {
    return false;
  }
  const { grade, role } = user;
  return role === 'ADMIN' || allowedGenerationForGrades.includes(grade);
}
