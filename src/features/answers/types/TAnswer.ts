import { Answer } from '@prisma/client';

import { ExtendNullWithUndefined, ReplaceNullWithUndefined } from '@/lib/ts';

export type TAnswer = ExtendNullWithUndefined<Answer>;
export type TAnswerReal = ReplaceNullWithUndefined<Answer>;

export type TAnswerId = TAnswer['id'];

export type TNewAnswer = Partial<Answer> & Pick<Answer, 'text' | 'questionId'>;
