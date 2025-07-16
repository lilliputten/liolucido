'use client';

import React from 'react';

import { TTopic } from '@/features/topics/types';

interface TopicsContextValue {
  topics: TTopic[];
  setTopics: React.Dispatch<React.SetStateAction<TTopic[]>>;
}

const TopicsContext = React.createContext<TopicsContextValue | undefined>(undefined);

interface TopicsContextProviderProps {
  children: React.ReactNode;
  initialTopics?: TTopic[];
}

export function TopicsContextProvider({
  children,
  initialTopics = [],
}: TopicsContextProviderProps) {
  const [topics, setTopics] = React.useState<TTopic[]>(initialTopics);

  const value = React.useMemo(
    () => ({
      topics,
      setTopics,
    }),
    [topics],
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
