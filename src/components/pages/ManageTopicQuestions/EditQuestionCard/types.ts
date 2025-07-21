import { TQuestionReal } from '@/features/questions/types';

export type TFormData = Pick<
  TQuestionReal,
  | 'text' // string
  | 'answersCountRandom' // boolean
  | 'answersCountMin' // number
  | 'answersCountMax' // number
>;
