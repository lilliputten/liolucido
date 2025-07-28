'use client';

import React from 'react';

import { TRoutePath } from '@/config/routesConfig';
import { TQuestion } from '@/features/questions/types';

import { QuestionsContextData } from './QuestionsContextDefinitions';

const QuestionsContext = React.createContext<QuestionsContextData | undefined>(undefined);

interface QuestionsContextProviderProps extends Omit<QuestionsContextData, 'setQuestions'> {
  children: React.ReactNode;
}

export function QuestionsContextProvider({
  children,
  questions: initialQuestions = [],
  routePath,
  topicRootRoutePath,
  topicsListRoutePath,
  topicId,
}: QuestionsContextProviderProps) {
  const [questions, setQuestions] = React.useState<TQuestion[]>(initialQuestions);

  const questionsContext = React.useMemo(
    () => ({
      questions,
      setQuestions,
      routePath: routePath as TRoutePath,
      topicsListRoutePath: topicsListRoutePath as TRoutePath,
      topicRootRoutePath: topicRootRoutePath as TRoutePath,
      topicId,
    }),
    [questions, routePath, topicRootRoutePath, topicsListRoutePath, topicId],
  );

  return <QuestionsContext.Provider value={questionsContext}>{children}</QuestionsContext.Provider>;
}

export function useQuestionsContext() {
  const context = React.useContext(QuestionsContext);
  if (!context) {
    throw new Error('useQuestionsContext must be used within QuestionsContextProvider');
  }
  return context;
}
