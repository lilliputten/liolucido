'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { isDev } from '@/constants';
import { TNewTopic, TTopic } from '@/features/topics/types';

export async function addNewTopic(newTopic: TNewTopic) {
  const user = await getCurrentUser();
  const userId = user?.id;
  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    /* // DEMO: Throw an error
     * throw new Error('Test error');
     */
    if (!userId) {
      throw new Error('Got undefined user.');
    }
    if (!newTopic.name) {
      throw new Error('Not specified topic name.');
    }
    /* NOTE: Ensure if the user exists (should be checked on the page load)
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
    console.error('[addNewTopic] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
