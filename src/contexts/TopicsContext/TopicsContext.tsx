'use client';

import React from 'react';

import { TRoutePath } from '@/config/routesConfig';
import {
  addedQuestionEventName,
  deletedQuestionEventName,
  TAddedQuestionDetail,
  TDeletedQuestionDetail,
} from '@/constants/eventTypes';
import { TTopic } from '@/features/topics/types';

import {
  defaultTopicsManageScope,
  defaultTopicsNamespace,
  TopicsContextData,
  topicsRoutes,
} from './TopicsContextDefinitions';

const TopicsContext = React.createContext<TopicsContextData | undefined>(undefined);

interface TopicsContextProviderProps extends Omit<TopicsContextData, 'setTopics'> {
  children: React.ReactNode;
}

export function TopicsContextProvider({
  children,
  topics: initialTopics = [],
  manageScope = defaultTopicsManageScope,
  namespace = defaultTopicsNamespace,
  routePath,
}: TopicsContextProviderProps) {
  const [topics, setTopics] = React.useState<TTopic[]>(initialTopics);

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
