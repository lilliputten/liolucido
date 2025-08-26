'use client';

import React from 'react';
import { toast } from 'sonner';

import { availableTopicsRoute } from '@/config/routesConfig';
import { generateArray } from '@/lib/helpers';
import { useAvailableQuestionById } from '@/hooks/react-query/useAvailableQuestionById';
import { Skeleton } from '@/components/ui/skeleton';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useAvailableAnswers, useGoToTheRoute } from '@/hooks';

import { WorkoutQuestion } from './WorkoutQuestion';

interface TMemo {
  nextPageTimerHandler?: ReturnType<typeof setTimeout>;
}

export function WorkoutQuestionContainer() {
  const {
    topic,
    workout,
    saveResultAndGoNext,
    saveResult,
    saveAnswer,
    finishWorkout,
    goNextQuestion,
    goPrevQuestion,
  } = useWorkoutContext();
  const selectedAnswerId = workout?.selectedAnswerId;

  const memo = React.useMemo<TMemo>(() => ({}), []);

  const workoutRoutePath = `${availableTopicsRoute}/${topic.id}/workout`;

  const goToTheRoute = useGoToTheRoute();

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

  const handleFinish = React.useCallback(() => {
    finishWorkout();
    setTimeout(() => {
      goToTheRoute(workoutRoutePath);
    }, 10);
  }, [finishWorkout, goToTheRoute, workoutRoutePath]);

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
      handleFinish();
    }
  }, [handleFinish, isExceed, currentStep, totalSteps, workout]);

  const availableQuestionQuery = useAvailableQuestionById({ id: questionId });
  const {
    question,
    isFetched: isQuestionFetched,
    isLoading: isQuestionLoading,
  } = availableQuestionQuery;

  // Fetch answers using dedicated hook
  const availableAnswersQuery = useAvailableAnswers({
    questionId,
    // enabled: !!questionId,
  });
  const {
    allAnswers: answers,
    isLoading: isAnswersLoading,
    error: answersError,
  } = availableAnswersQuery;

  const isLoadingOverall =
    (!question || !answers) && (isAnswersLoading || !isQuestionFetched || isQuestionLoading);

  // Handle answers loading error
  React.useEffect(() => {
    if (answersError) {
      const message = 'Cannot load answers data';
      toast.error(message);
    }
  }, [answersError]);

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

  if (isLoadingOverall) {
    return (
      <div className="flex flex-col gap-6 py-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-8 w-full" />
        {/* Emulate answers */}
        <div className="grid gap-4 py-4 md:grid-cols-2">
          {generateArray(2).map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
        {/* Emulate buttons */}
        <div className="flex justify-center gap-4">
          {generateArray(2).map((i) => (
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
      <PageError
        error="Cannot get current question id from questions order."
        padded={false}
        border={false}
      />
    );
  }

  if (!question) {
    return <PageError error={`Not found question (${questionId}).`} padded={false} />;
  }

  return (
    <WorkoutQuestion
      questionText={question?.text || ''}
      answers={answers}
      isAnswersLoading={isAnswersLoading}
      currentStep={currentStep}
      totalSteps={totalSteps}
      onAnswerSelect={onAnswerSelect}
      onSkip={onSkip}
      onFinish={handleFinish}
      onContinue={goToTheNextQuestion}
      goPrevQuestion={goToThePrevQuestion}
      selectedAnswerId={selectedAnswerId}
    />
  );
}
