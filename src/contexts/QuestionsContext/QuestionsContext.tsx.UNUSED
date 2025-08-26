'use client';

import React from 'react';

import { TRoutePath } from '@/config/routesConfig';
import {
  addedAnswerEventName,
  deletedAnswerEventName,
  TAddedAnswerDetail,
  TDeletedAnswerDetail,
} from '@/constants/eventTypes';
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

  // Listen for the added or deleted answer events (taking only questionId and answersCount data from the event)
  React.useEffect(() => {
    const handleAnswersCountChange = (
      event: CustomEvent<TAddedAnswerDetail | TDeletedAnswerDetail>,
    ) => {
      const { questionId, answersCount } = event.detail;
      setQuestions((questions) => {
        const updatedQuestions = questions.map((question) => {
          if (question.id === questionId) {
            question = { ...question, _count: { ...question?._count, answers: answersCount } };
          }
          return question;
        });
        return updatedQuestions;
      });
    };
    window.addEventListener(addedAnswerEventName, handleAnswersCountChange as EventListener);
    window.addEventListener(deletedAnswerEventName, handleAnswersCountChange as EventListener);
    return () => {
      window.removeEventListener(addedAnswerEventName, handleAnswersCountChange as EventListener);
      window.removeEventListener(deletedAnswerEventName, handleAnswersCountChange as EventListener);
    };
  }, []);

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
