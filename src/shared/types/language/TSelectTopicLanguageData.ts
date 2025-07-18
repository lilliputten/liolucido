import { TTopicId } from '@/features/topics/types';

import { TLanguageId } from './TLanguage';

export const selectTopicEventName = 'language-selected';

export interface TSelectLanguageData {
  langCode?: TLanguageId; // Language code (eg, "en", "ru", etc, or custom)
  langName?: string; // Language name
  langCustom?: boolean; // Is the language a custom one?
}

export interface TSelectTopicLanguageData extends TSelectLanguageData {
  topicId: TTopicId;
}
