'use client';

import React from 'react';

import { TLanguage, TLanguageId } from '@/lib/types';

interface TContext {
  langCode?: TLanguageId; // Language code (eg, "en", "ru", etc, or custom)
  langName?: string; // Language name
  langCustom?: boolean; // Is the language a custom one?
  hasSelected?: boolean; // Was language selected?
}
export type TSelectLanguageContext = TContext;

const SelectLanguageContext = React.createContext<TContext | undefined>(undefined);

interface SelectLanguageContextProviderProps {
  children: React.ReactNode;
  initialLangCode?: TContext['langCode'];
  initialLangName?: TContext['langName'];
  initialLangCustom?: TContext['langCustom'];
  initialHasSelected?: TContext['hasSelected'];
}

export function SelectLanguageContextProvider({
  children,
  initialLangCode,
  initialLangName,
  initialLangCustom,
  initialHasSelected,
}: SelectLanguageContextProviderProps) {
  const [langCode, setLangCode] = React.useState<TContext['langCode']>(initialLangCode);
  const [langName, setLangName] = React.useState<TContext['langName']>(initialLangName);
  const [langCustom, setLangCustom] = React.useState<TContext['langCustom']>(initialLangCustom);
  const [hasSelected, setHasSelected] = React.useState<TContext['hasSelected']>(initialHasSelected);

  const value = React.useMemo(
    () => ({
      langCode,
      setLangCode,
      langName,
      setLangName,
      langCustom,
      setLangCustom,
      hasSelected,
      setHasSelected,
    }),
    [
      langCode,
      setLangCode,
      langName,
      setLangName,
      langCustom,
      setLangCustom,
      hasSelected,
      setHasSelected,
    ],
  );

  return <SelectLanguageContext.Provider value={value}>{children}</SelectLanguageContext.Provider>;
}

export function useSelectLanguageContext() {
  const context = React.useContext(SelectLanguageContext);
  if (!context) {
    throw new Error('useSelectLanguageContext must be used within SelectLanguageContextProvider');
  }
  return context;
}
