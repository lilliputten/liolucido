'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { TNewTopic, TTopic } from '@/features/topics/types';

export async function addNewTopic(newTopic: TNewTopic) {
  const user = await getCurrentUser();
  const userId = user?.id;
  try {
    if (!userId) {
      throw new Error('Got undefined user.');
    }
    if (!newTopic.name) {
      throw new Error('Not specified topic name.');
    }
    /* NOTE: Ensure the user is exist (should be checked on the page load)
     * const isUserExists = await checkIfUserExists(userId);
     * if (!isUserExists) {
     *   throw new Error('The specified user does not exist.');
     * }
     */
    const data = { ...newTopic, userId };
    const addedTopic = await prisma.topic.create({
      data,
    });
    return addedTopic as TTopic;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[createUserOrUpdateTelegramUser:transaction] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
