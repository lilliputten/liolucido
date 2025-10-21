import { TQuestionReal } from '@/features/questions/types';

export type TFormData = Pick<
  TQuestionReal,
  | 'text' // string
  | 'isGenerated' // boolean
  | 'answersCountRandom' // boolean
  | 'answersCountMin' // number
  | 'answersCountMax' // number
>;
