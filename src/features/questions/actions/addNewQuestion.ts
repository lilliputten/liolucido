'use server';

import { prisma } from '@/lib/db';
import { isDev } from '@/constants';
import { TNewQuestion } from '@/features/questions/types';

import { TQuestion } from '../types';

export async function addNewQuestion(newQuestion: TNewQuestion) {
  try {
    if (isDev) {
      // DEBUG: Emulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    /* // TODO: Check user rights to modify topic?
     * const user = await getCurrentUser();
     * const userId = user?.id;
     * if (!userId) {
     *   throw new Error('Got undefined user');
     * }
     */
    if (!newQuestion.text) {
      throw new Error('Not specified question name');
    }
    const data = { ...newQuestion };
    const addedQuestion = await prisma.question.create({
      data,
    });
    return addedQuestion as TQuestion;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[addNewQuestion] catch', {
      error,
    });
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
