'use server';

import { AIGenerationError } from '@/lib/errors/AIGenerationError';

import { TAIGenerationsStatus } from '../types/TAIGenerationsStatus';
import { getUserAIGenerationsStatus } from './getUserAIGenerationsStatus';

export async function checkAllowedAIGenerations(): Promise<boolean> {
  const limits: TAIGenerationsStatus = await getUserAIGenerationsStatus();
  const { availableGenerations, reasonCode } = limits;
  const allowed = !!availableGenerations;
  if (!allowed && reasonCode) {
    throw new AIGenerationError(reasonCode);
  }
  return allowed;
}
