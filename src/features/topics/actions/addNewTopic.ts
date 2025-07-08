'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { TNewTopic, TTopic } from '@/features/topics/types';

export async function addNewTopic(newTopic: TNewTopic) {
  const user = await getCurrentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error('Got undefined user.');
  }
  if (!newTopic.name) {
    throw new Error('Not specified topic name.');
  }
  const data = { ...newTopic, userId };
  const addedTopic = await prisma.topic.create({
    data,
  });
  return addedTopic as TTopic;
}
