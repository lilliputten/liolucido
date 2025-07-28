'use client';

import React from 'react';

import { TRoutePath } from '@/config/routesConfig';
import { TAnswer } from '@/features/answers/types';

import { AnswersContextData } from './AnswersContextDefinitions';

const AnswersContext = React.createContext<AnswersContextData | undefined>(undefined);

interface AnswersContextProviderProps extends Omit<AnswersContextData, 'setAnswers'> {
  children: React.ReactNode;
}

export function AnswersContextProvider({
  children,
  answers: initialAnswers = [],
  routePath,
  questionsListRoutePath,
  questionRootRoutePath,
  questionId,
  topicsListRoutePath,
  topicRootRoutePath,
  topicId,
  // topicName,
}: AnswersContextProviderProps) {
  const [answers, setAnswers] = React.useState<TAnswer[]>(initialAnswers);

  const answersContext = React.useMemo(
    () => ({
      answers,
      setAnswers,
      routePath: routePath as TRoutePath,
      questionsListRoutePath: questionsListRoutePath as TRoutePath,
      questionRootRoutePath: questionRootRoutePath as TRoutePath,
      questionId,
      topicsListRoutePath: topicsListRoutePath as TRoutePath,
      topicRootRoutePath: topicRootRoutePath as TRoutePath,
      topicId,
      // topicName,
    }),
    [
      answers,
      routePath,
      questionsListRoutePath,
      questionRootRoutePath,
      questionId,
      topicsListRoutePath,
      topicRootRoutePath,
      topicId,
      // topicName,
    ],
  );

  return <AnswersContext.Provider value={answersContext}>{children}</AnswersContext.Provider>;
}

export function useAnswersContext() {
  const context = React.useContext(AnswersContext);
  if (!context) {
    throw new Error('useAnswersContext must be used within AnswersContextProvider');
  }
  return context;
}
