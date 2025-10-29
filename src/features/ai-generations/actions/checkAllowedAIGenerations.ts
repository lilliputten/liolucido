'use server';

import { BASIC_USER_GENERATIONS, PRO_USER_MONTHLY_GENERATIONS } from '@/config/envServer';
import { AIGenerationError } from '@/lib/errors/AIGenerationError';
import { getCurrentUser } from '@/lib/session';

import { getUserAIGenerationsStats } from './getUserAIGenerationsStats';

export async function checkAllowedAIGenerations(): Promise<boolean> {
  const user = await getCurrentUser();

  try {
    if (!user) {
      throw new AIGenerationError('USER_NOT_LOGGED');
    }

    const { grade, role } = user;

    if (grade === 'GUEST') {
      throw new AIGenerationError('GUEST_USERS_ARE_NOT_ALLOWED_TO_GENERATE');
    }

    if (grade === 'PREMIUM' || role === 'ADMIN') {
      return true;
    }

    const { totalGenerations, lastMonthGenerations } = await getUserAIGenerationsStats();

    if (grade === 'BASIC') {
      if (totalGenerations >= BASIC_USER_GENERATIONS) {
        throw new AIGenerationError('BASIC_USER_HAS_EXCEEDED_GENERATION_LIMIT');
      }
    } else if (grade === 'PRO') {
      if (lastMonthGenerations >= PRO_USER_MONTHLY_GENERATIONS) {
        throw new AIGenerationError('PRO_USER_HAS_EXCEEDED_GENERATION_LIMIT');
      }
    }

    return true;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error('[checkAllowedAIGenerations]', errMsg, {
      error,
      user,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
    // if (error instanceof AIGenerationError) {
    //   throw error;
    // }
    // throw new AIGenerationError('AN_ERROR_OCCURRED', getErrorText(error));
  }
}
