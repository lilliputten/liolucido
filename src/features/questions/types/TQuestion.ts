import { ExtendNullWithUndefined, ReplaceNullWithUndefined } from '@/lib/ts';
import { Question } from '@/generated/prisma';

export type TQuestion = ExtendNullWithUndefined<Question> & { _count?: { answers: number } };
export type TQuestionReal = ReplaceNullWithUndefined<Question>;
export type TQuestionData = Omit<TQuestionReal, 'createdAt' | 'updatedAt'>;

export type TQuestionId = TQuestion['id'];

export type TNewQuestion = Partial<Question> & Pick<Question, 'text' | 'topicId'>;

export type TAvailableQuestion = TQuestion;
