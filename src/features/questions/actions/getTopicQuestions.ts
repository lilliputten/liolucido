'use server';

import { prisma } from '@/lib/db';
import { isDev } from '@/constants';
import { TTopicId } from '@/features/topics/types';

import { TQuestion } from '../types';

export async function getTopicQuestions(topicId: TTopicId) {
  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const questions: TQuestion[] = await prisma.question.findMany({
      where: { topicId },
    });
    return questions;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[getTopicQuestions] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
