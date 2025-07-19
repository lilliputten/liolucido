'use client';

import React from 'react';

import { TTopic } from '@/features/topics/types';

const defaultNamespace = 'ManageTopicsPage';

export enum TopicsManageType {
  myTopics,
  allTopics,
}

interface TopicsContextValue {
  topics: TTopic[];
  setTopics: React.Dispatch<React.SetStateAction<TTopic[]>>;
  /** Translation namespace, for `useTranslations` or `getTranslations`, default is "ManageTopicsPage" */
  namespace: string;
  /** Topics type: only user's topics or all topics (for admin) */
  manageType: TopicsManageType;
}

const TopicsContext = React.createContext<TopicsContextValue | undefined>(undefined);

interface TopicsContextProviderProps {
  children: React.ReactNode;
  topics?: TTopic[];
  namespace?: string;
  manageType?: TopicsManageType;
}

export function TopicsContextProvider({
  children,
  topics: initialTopics = [],
  namespace = defaultNamespace,
  manageType = TopicsManageType.myTopics,
}: TopicsContextProviderProps) {
  const [topics, setTopics] = React.useState<TTopic[]>(initialTopics);

  const value = React.useMemo(
    () => ({
      topics,
      setTopics,
      namespace,
      manageType,
    }),
    [topics, namespace, manageType],
  );

  return <TopicsContext.Provider value={value}>{children}</TopicsContext.Provider>;
}

export function useTopicsContext() {
  const context = React.useContext(TopicsContext);
  if (!context) {
    throw new Error('useTopicsContext must be used within TopicsContextProvider');
  }
  return context;
}
