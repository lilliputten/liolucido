'use client';

import React from 'react';
import { toast } from 'sonner';

import { APIError } from '@/shared/types/api';
import { handleApiResponse } from '@/lib/api';
import { invalidateReactQueryKeys } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { isDev } from '@/constants';
import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { TAnswerData } from '@/features/answers/types';

import { WorkoutQuestion } from './WorkoutQuestion';

interface TMemo {
  nextPageTimerHandler?: ReturnType<typeof setTimeout>;
}

export function WorkoutQuestionContainer() {
  const {
    workout,
    saveResultAndGoNext,
    saveResult,
    saveAnswer,
    finishWorkout,
    goNextQuestion,
    goPrevQuestion,
  } = useWorkoutContext();
  const { questions } = useQuestionsContext();
  const [answers, setAnswers] = React.useState<TAnswerData[]>([]);
  const [isPending, startTransition] = React.useTransition();
  const selectedAnswerId = workout?.selectedAnswerId;

  const memo = React.useMemo<TMemo>(() => ({}), []);

  // Prepare data...
  const questionsOrder = React.useMemo(
    () => (workout?.questionsOrder || '').split(' '),
    [workout?.questionsOrder],
  );
  const totalSteps = questionsOrder.length;
  const stepIndex = workout?.stepIndex || 0;
  const currentStep = stepIndex + 1;
  const questionId = questionsOrder[stepIndex];
  const isExceed = currentStep > totalSteps;

  React.useEffect(() => {
    if (isExceed) {
      const error = new Error(
        `The step index (${currentStep}) exceeds the total steps count (${totalSteps})`,
      );
      // eslint-disable-next-line no-console
      console.warn('[WorkoutQuestionContainer]', error, {
        totalSteps,
        currentStep,
        workout,
      });
      finishWorkout();
    }
  }, [finishWorkout, isExceed, currentStep, totalSteps, workout]);

  const question = React.useMemo(() => {
    if (!questionId || !questions) return null;
    return questions.find((q) => q.id === questionId);
  }, [questionId, questions]);

  // Fetch answers
  React.useEffect(() => {
    if (!question) return;
    startTransition(async () => {
      const url = `/api/questions/${question.id}/answers`;
      try {
        const result = await handleApiResponse<TAnswerData[]>(fetch(url), {
          debugDetails: { initiator: 'WorkoutQuestionContainer', url },
          onInvalidateKeys: invalidateReactQueryKeys,
        });
        if (result.ok && result.data) {
          setAnswers(result.data);
        } else {
          setAnswers([]);
        }
      } catch (error) {
        const details = error instanceof APIError ? error.details : null;
        const message = 'Cannot load answers data';
        // eslint-disable-next-line no-console
        console.error('[WorkoutQuestionContainer]', message, {
          details,
          error,
          url,
        });
        debugger; // eslint-disable-line no-debugger
        setAnswers([]);
        toast.error(message);
      }
    });
  }, [question, startTransition]);

  const goToTheNextQuestion = React.useCallback(() => {
    if (memo.nextPageTimerHandler) {
      clearTimeout(memo.nextPageTimerHandler);
      memo.nextPageTimerHandler = undefined;
    }
    goNextQuestion();
  }, [memo, goNextQuestion]);

  const goToThePrevQuestion = React.useCallback(() => {
    goPrevQuestion();
  }, [goPrevQuestion]);

  const onAnswerSelect = React.useCallback(
    (answerId: string) => {
      const answer = answers.find(({ id }) => id === answerId);
      if (answer) {
        const { isCorrect } = answer;
        // Update workout with result and move to next question
        saveAnswer(answerId);
        saveResult(isCorrect);
        // Auto-advance after delay
        if (isCorrect) {
          memo.nextPageTimerHandler = setTimeout(goToTheNextQuestion, 2000);
        }
      }
    },
    [memo, answers, goToTheNextQuestion, saveResult, saveAnswer],
  );

  const onSkip = React.useCallback(() => {
    // Update workout with false result and move to next question
    saveResultAndGoNext(undefined);
  }, [saveResultAndGoNext]);

  if (isPending) {
    return (
      <div className="flex flex-col gap-6 py-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-8 w-full" />
        <div className="grid gap-4 py-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-15 w-full" />
          ))}
        </div>
        <div className="flex justify-center gap-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-20" />
          ))}
        </div>
      </div>
    );
  }

  if (!workout) {
    return <div className="py-6">No active workout found.</div>;
  }

  function PutDevDebugInfo() {
    if (isDev) {
      return (
        <div className="flex flex-col gap-2 text-xs opacity-50">
          <div>
            <span className="opacity-50">Questions order is:</span> {questionsOrder.join(' ')}
          </div>
          <div>
            <span className="opacity-50">Step:</span> {currentStep} / {totalSteps}
          </div>
        </div>
      );
    }
  }

  if (isExceed) {
    return (
      <div className="flex flex-col gap-3 py-6">
        <div>The workout has been (suddenly) finished.</div>
        <PutDevDebugInfo />
      </div>
    );
  }

  if (!questionId) {
    return (
      <div className="flex flex-col gap-3 py-6">
        <div>Cannot get current question id from questions order.</div>
        <PutDevDebugInfo />
      </div>
    );
  }

  if (!question) {
    return <div className="py-6">Not found question ({questionId}).</div>;
  }

  return (
    <WorkoutQuestion
      questionText={question?.text || ''}
      answers={answers}
      currentStep={currentStep}
      totalSteps={totalSteps}
      onAnswerSelect={onAnswerSelect}
      onSkip={onSkip}
      onFinish={finishWorkout}
      onContinue={goToTheNextQuestion}
      goPrevQuestion={goToThePrevQuestion}
      selectedAnswerId={selectedAnswerId}
    />
  );
}
