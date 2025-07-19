import { TTopicId, TTopicNoNulls } from './TTopic';

export const selectTopicEventName = 'SelectTopicLanguage';

// export interface TTopicLanguageData {
//   langCode?: TLanguageId; // Language code (eg, "en", "ru", etc, or custom)
//   langName?: string; // Language name
//   langCustom?: boolean; // Is the language a custom one?
// }
export type TTopicLanguageData = Pick<TTopicNoNulls, 'langCode' | 'langName' | 'langCustom'>;
export interface TSelectTopicLanguageData extends TTopicLanguageData {
  topicId: TTopicId;
}
