import { TLanguageId } from './TLanguage';

export interface TSelectTopicLanguageData {
  langCode?: TLanguageId; // Language code (eg, "en", "ru", etc, or custom)
  langName?: string; // Language name
  langCustom?: boolean; // Is the language a custom one?
}
