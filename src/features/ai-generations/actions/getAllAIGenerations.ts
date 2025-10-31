'use server';

import { prisma } from '@/lib/db';
import { AIGenerationError } from '@/lib/errors/AIGenerationError';
import { getCurrentUser } from '@/lib/session';

export async function getAllAIGenerations() {
  const user = await getCurrentUser();

  if (!user) {
    throw new AIGenerationError('USER_NOT_LOGGED');
  }

  const userId = user.id;

  const generations = await prisma.aIGeneration.findMany({
    where: { userId },
    orderBy: { finishedAt: 'desc' },
  });

  return generations;
}
