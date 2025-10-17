import { TAnswerReal } from '@/features/answers/types';

export type TFormData = Pick<
  TAnswerReal,
  | 'text' // string
  | 'isCorrect' // Boolean @default(false) @map("is_correct")
  | 'isGenerated' // Boolean @default(false) @map("is_generated")
>;
