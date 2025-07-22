import { TTopicId, TTopicReal } from './TTopic';

export const selectTopicEventName = 'SelectTopicLanguage';

export type TTopicLanguageData = Pick<TTopicReal, 'langCode' | 'langName' | 'langCustom'>;
export interface TSelectTopicLanguageData extends TTopicLanguageData {
  topicId?: TTopicId;
}
