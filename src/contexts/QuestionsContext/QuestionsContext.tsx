'use client';

import React from 'react';

import { TRoutePath } from '@/config/routesConfig';
import { TQuestion } from '@/features/questions/types';
import { TTopicId } from '@/features/topics/types';

import { QuestionsContextData } from './QuestionsContextDefinitions';

const QuestionsContext = React.createContext<QuestionsContextData | undefined>(undefined);

interface QuestionsContextProviderProps {
  children: React.ReactNode;
  questions?: TQuestion[];
  routePath: TRoutePath;
  topicId: TTopicId;
}

export function QuestionsContextProvider({
  children,
  questions: initialQuestions = [],
  routePath,
  topicId,
}: QuestionsContextProviderProps) {
  const [questions, setQuestions] = React.useState<TQuestion[]>(initialQuestions);

  const questionsContext = React.useMemo(
    () => ({
      questions,
      setQuestions,
      routePath: routePath as TRoutePath,
      topicId,
    }),
    [questions, routePath, topicId],
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
