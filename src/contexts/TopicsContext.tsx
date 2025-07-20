'use client';

import React from 'react';

import { TRoutePath } from '@/config/routesConfig';
import { TTopic } from '@/features/topics/types';

import {
  defaultTopicsManageType,
  defaultTopicsNamespace,
  TopicsContextData,
  topicsRoutes,
  TTopicsManageType,
} from './TopicsContextConstants';

const TopicsContext = React.createContext<TopicsContextData | undefined>(undefined);

interface TopicsContextProviderProps {
  children: React.ReactNode;
  topics?: TTopic[];
  manageType?: TTopicsManageType;
  namespace?: string;
  routePath?: TRoutePath;
}

export function TopicsContextProvider({
  children,
  topics: initialTopics = [],
  manageType = defaultTopicsManageType,
  namespace = defaultTopicsNamespace,
  routePath,
}: TopicsContextProviderProps) {
  const [topics, setTopics] = React.useState<TTopic[]>(initialTopics);

  const topicsContext = React.useMemo(
    () => ({
      topics,
      setTopics,
      namespace,
      manageType,
      routePath: (routePath || topicsRoutes[manageType]) as TRoutePath,
    }),
    [topics, namespace, manageType, routePath],
  );

  return <TopicsContext.Provider value={topicsContext}>{children}</TopicsContext.Provider>;
}

export function useTopicsContext() {
  const context = React.useContext(TopicsContext);
  if (!context) {
    throw new Error('useTopicsContext must be used within TopicsContextProvider');
  }
  return context;
}
