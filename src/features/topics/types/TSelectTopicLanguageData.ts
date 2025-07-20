import { TTopicId, TTopicNoNulls } from './TTopic';

export const selectTopicEventName = 'SelectTopicLanguage';

export type TTopicLanguageData = Pick<TTopicNoNulls, 'langCode' | 'langName' | 'langCustom'>;
export interface TSelectTopicLanguageData extends TTopicLanguageData {
  topicId: TTopicId;
}
