'use server';

import { prisma } from '@/lib/db';
import { isDev } from '@/constants';

import { TTopic, TTopicId } from '../types';

export async function getTopic(id: TTopicId) {
  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const topic: TTopic | undefined =
      (await prisma.topic.findUnique({
        where: { id },
      })) || undefined;
    return topic;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[checkIfTopicExists] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
