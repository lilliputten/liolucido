'use server';

import { cache } from 'react';

import { BASIC_USER_GENERATIONS, PRO_USER_MONTHLY_GENERATIONS } from '@/config/envServer';
import { prisma } from '@/lib/db';
import { AIGenerationError } from '@/lib/errors/AIGenerationError';
import { getErrorText } from '@/lib/helpers';
import { getCurrentUser } from '@/lib/session';

export const checkUserAllowedGenerations = cache(async (): Promise<boolean> => {
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

    const userId = user.id;

    if (grade === 'BASIC') {
      const totalGenerations = await prisma.aIGeneration.count({
        where: { userId },
      });
      if (totalGenerations >= BASIC_USER_GENERATIONS) {
        throw new AIGenerationError('BASIC_USER_HAS_EXCEEDED_GENERATION_LIMIT');
      }
    } else if (grade === 'PRO') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const monthlyGenerations = await prisma.aIGeneration.count({
        where: {
          userId,
          finishedAt: {
            gte: oneMonthAgo,
          },
        },
      });
      if (monthlyGenerations >= PRO_USER_MONTHLY_GENERATIONS) {
        throw new AIGenerationError('PRO_USER_HAS_EXCEEDED_GENERATION_LIMIT');
      }
    }

    return true;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line no-console
    console.error('[checkUserAllowedGenerations]', errMsg, {
      error,
      user,
    });
    debugger; // eslint-disable-line no-debugger
    if (error instanceof AIGenerationError) {
      throw error;
    }
    throw new AIGenerationError('AN_ERROR_OCCURRED', getErrorText(error));
  }
});
