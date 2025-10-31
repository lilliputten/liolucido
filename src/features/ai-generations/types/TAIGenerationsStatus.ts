import { TAIGenerationErrorCode } from '@/lib/errors/AIGenerationError';
import { UserGradeType, UserRoleType } from '@/generated/prisma';

export const unlimitedGenerations = 999999999;

export type TGenerationMode = 'TOTAL' | 'MONTHLY';

export interface TAIGenerationsStatus {
  availableGenerations?: number;
  usedGenerations?: number;
  generationMode?: TGenerationMode;
  role?: UserRoleType;
  grade?: UserGradeType;
  reasonCode?: TAIGenerationErrorCode;
}
