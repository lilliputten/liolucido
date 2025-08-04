'use client';

import React from 'react';

import { TRoutePath } from '@/config/routesConfig';
import {
  addedQuestionEventName,
  deletedQuestionEventName,
  TAddedQuestionDetail,
  TDeletedQuestionDetail,
} from '@/constants/eventTypes';
import { TAvailableTopic } from '@/features/topics/types';

import {
  defaultTopicsManageScope,
  defaultTopicsNamespace,
  TopicsContextData,
  topicsRoutes,
} from './TopicsContextDefinitions';

const TopicsContext = React.createContext<TopicsContextData | undefined>(undefined);

interface TopicsContextProviderProps
  extends Omit<TopicsContextData, 'setTopics' | 'totalCount' | 'setTotalCount'> {
  children: React.ReactNode;
  totalCount?: number;
}

export function TopicsContextProvider({
  children,
  totalCount: initialTotalCount,
  topics: initialTopics = [],
  manageScope = defaultTopicsManageScope,
  namespace = defaultTopicsNamespace,
  routePath,
}: TopicsContextProviderProps) {
  const [topics, setTopics] = React.useState<TAvailableTopic[]>(initialTopics);
  const [totalCount, setTotalCount] = React.useState<number>(
    initialTotalCount ?? initialTopics.length,
  );

  // Listen for the added and deleted question events (taking only topicId and questionsCount data from the event)
  React.useEffect(() => {
    const handleQuestionsCountChange = (
      event: CustomEvent<TAddedQuestionDetail | TDeletedQuestionDetail>,
    ) => {
      const { topicId, questionsCount } = event.detail;
      setTopics((topics) => {
        const updatedTopics = topics.map((topic) => {
          if (topic.id === topicId) {
            topic = { ...topic, _count: { ...topic?._count, questions: questionsCount } };
          }
          return topic;
        });
        return updatedTopics;
      });
    };
    window.addEventListener(addedQuestionEventName, handleQuestionsCountChange as EventListener);
    window.addEventListener(deletedQuestionEventName, handleQuestionsCountChange as EventListener);
    return () => {
      window.removeEventListener(
        addedQuestionEventName,
        handleQuestionsCountChange as EventListener,
      );
      window.removeEventListener(
        deletedQuestionEventName,
        handleQuestionsCountChange as EventListener,
      );
    };
  }, []);

  const topicsContext = React.useMemo(
    () => ({
      topics,
      setTopics,
      totalCount,
      setTotalCount,
      namespace,
      manageScope,
      routePath: (routePath || topicsRoutes[manageScope]) as TRoutePath,
    }),
    [topics, totalCount, namespace, manageScope, routePath],
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
