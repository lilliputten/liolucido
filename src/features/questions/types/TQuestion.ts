import { Question } from '@prisma/client';

import { ExtendNullWithUndefined, ReplaceNullWithUndefined } from '@/lib/ts';

export type TQuestion = ExtendNullWithUndefined<Question>;
export type TQuestionReal = ReplaceNullWithUndefined<Question>;

export type TQuestionId = TQuestion['id'];

export type TNewQuestion = Partial<Question> & Pick<Question, 'text' | 'topicId'>;
