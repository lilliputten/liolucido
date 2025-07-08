'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';

import { TTopic } from '../types';

export async function getAllTopics() {
  const user = await getCurrentUser();
  const userId = user?.id;
  if (userId) {
    const topics: TTopic[] = await prisma.topic.findMany({
      where: { userId },
    });
    return topics;
  }
  return undefined;
}
