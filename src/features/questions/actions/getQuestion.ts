'use server';

import { prisma } from '@/lib/db';

import { TQuestion, TQuestionId } from '../types';

export async function getQuestion(id: TQuestionId): Promise<TQuestion | null> {
  try {
    const question = await prisma.question.findUnique({
      where: { id },
    });
    return question;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[getQuestion] Error:', error);
    debugger; // eslint-disable-line no-debugger
    throw error;
  }
}
