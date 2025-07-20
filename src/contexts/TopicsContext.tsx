'use client';

import React from 'react';

import { TRoutePath } from '@/config/routesConfig';
import { TTopic } from '@/features/topics/types';

import {
  defaultTopicsManageScope,
  defaultTopicsNamespace,
  TopicsContextData,
  topicsRoutes,
  TTopicsManageScopeId,
} from './TopicsContextConstants';

const TopicsContext = React.createContext<TopicsContextData | undefined>(undefined);

interface TopicsContextProviderProps {
  children: React.ReactNode;
  topics?: TTopic[];
  manageScope?: TTopicsManageScopeId;
  namespace?: string;
  routePath?: TRoutePath;
}

export function TopicsContextProvider({
  children,
  topics: initialTopics = [],
  manageScope = defaultTopicsManageScope,
  namespace = defaultTopicsNamespace,
  routePath,
}: TopicsContextProviderProps) {
  const [topics, setTopics] = React.useState<TTopic[]>(initialTopics);

  const topicsContext = React.useMemo(
    () => ({
      topics,
      setTopics,
      namespace,
      manageScope,
      routePath: (routePath || topicsRoutes[manageScope]) as TRoutePath,
    }),
    [topics, namespace, manageScope, routePath],
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
