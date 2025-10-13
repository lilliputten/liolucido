import { TTopicReal } from '@/features/topics/types';

export type TFormData = Pick<
  TTopicReal,
  | 'name' // string
  | 'description' // string
  | 'isPublic' // boolean
  | 'keywords' // string
  | 'langCode' // string (TLanguageId)
  | 'langName' // string
  | 'langCustom' // boolean
  | 'answersCountRandom' // boolean
  | 'answersCountMin' // number
  | 'answersCountMax' // number
>;
