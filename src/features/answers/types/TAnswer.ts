import { ExtendNullWithUndefined, ReplaceNullWithUndefined } from '@/lib/ts';
import { Answer } from '@/generated/prisma';

export type TAnswer = ExtendNullWithUndefined<Answer>;
export type TAnswerReal = ReplaceNullWithUndefined<Answer>;
export type TAnswerData = Omit<TAnswerReal, 'createdAt' | 'updatedAt'>;

export type TAnswerId = TAnswer['id'];

export type TNewAnswer = Partial<Answer> & Pick<Answer, 'text' | 'questionId'>;
