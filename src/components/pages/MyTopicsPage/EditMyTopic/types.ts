import { TTopicNoNulls } from '@/features/topics/types';

export type TFormData = Pick<
  TTopicNoNulls,
  | 'name' // string
  | 'isPublic' // boolean
  | 'keywords' // string
  | 'langCode' // string (TLanguageId)
  | 'langName' // string
  | 'langCustom' // boolean
  | 'answersCountRandom' // boolean
  | 'answersCountMin' // number
  | 'answersCountMax' // number
>;
