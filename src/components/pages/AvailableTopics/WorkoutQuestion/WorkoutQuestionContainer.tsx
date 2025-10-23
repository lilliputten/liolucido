'use client';

import React from 'react';
import { toast } from 'sonner';

import { availableTopicsRoute } from '@/config/routesConfig';
import { generateArray } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useAvailableQuestionById } from '@/hooks/react-query/useAvailableQuestionById';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { useAvailableAnswers, useGoToTheRoute } from '@/hooks';

import { WorkoutQuestion } from './WorkoutQuestion';

interface TMemo {
  nextPageTimerHandler?: ReturnType<typeof setTimeout>;
  isGoingOut?: boolean;
}

export function WorkoutQuestionContainer() {
  const memo = React.useMemo<TMemo>(() => ({}), []);
  const {
    topicId,
    workout,
    saveResultAndGoNext,
    saveResult,
    saveAnswer,
    finishWorkout,
    goNextQuestion,
    goPrevQuestion,
  } = useWorkoutContext();

  // Prepare data...
  const questionsOrder = React.useMemo(
    () => (workout?.questionsOrder ? workout?.questionsOrder.split(' ') : []),
    [workout?.questionsOrder],
  );

  const totalSteps = questionsOrder.length;
  const stepIndex = workout?.stepIndex || 0;
  const currentStep = stepIndex + 1;
  const questionId = questionsOrder[stepIndex];
  const isExceed = currentStep > totalSteps;

  React.useEffect(() => {
    console.log('[WorkoutQuestionContainer:DEBUG]', {
      totalSteps,
      questionsOrder,
      questionId,
      workout,
      // question,
      // answers,
      // isAnswersLoading,
      // isQuestionFetched,
      // isQuestionLoading,
    });
  }, [totalSteps, questionsOrder, questionId, workout]);

  const workoutRoutePath = `${availableTopicsRoute}/${topicId}/workout`;

  const goToTheRoute = useGoToTheRoute();

  const handleFinishWorkout = React.useCallback(() => {
    console.log('[WorkoutQuestionContainer:handleFinishWorkout]', {
      workoutRoutePath,
    });
    debugger;
    finishWorkout();
    setTimeout(() => {
      goToTheRoute(workoutRoutePath);
    }, 10);
  }, [finishWorkout, goToTheRoute, workoutRoutePath]);

  /* // DEBUG
   * React.useEffect(() => {
   *   const diff_finishWorkout = memo.finishWorkout !== finishWorkout;
   *   // const diff_isExceed = memo.isExceed !== isExceed;
   *   // const diff_currentStep = memo.currentStep !== currentStep;
   *   // const diff_totalSteps = memo.totalSteps !== totalSteps;
   *   const diff_handleFinishWorkout = memo.handleFinishWorkout !== handleFinishWorkout;
   *   // eslint-disable-next-line no-console
   *   console.log('[WorkoutQuestionContainer:Effect:DEBUG]', {
   *     memo,
   *     //
   *     diff_finishWorkout,
   *     // diff_isExceed,
   *     // diff_currentStep,
   *     // diff_totalSteps,
   *     diff_handleFinishWorkout,
   *   });
   *   debugger;
   *   memo.finishWorkout = finishWorkout;
   *   // memo.isExceed = isExceed;
   *   // memo.currentStep = currentStep;
   *   // memo.totalSteps = totalSteps;
   *   memo.handleFinishWorkout = handleFinishWorkout;
   * }, [
   *   memo,
   *   //
   *   finishWorkout,
   *   // isExceed,
   *   // currentStep,
   *   // totalSteps,
   *   handleFinishWorkout,
   * ]);
   */

  React.useEffect(() => {
    if (isExceed && !memo.isGoingOut) {
      const error = new Error(
        `The step index (${currentStep}) exceeds the total steps count (${totalSteps})`,
      );
      // eslint-disable-next-line no-console
      console.warn('[WorkoutQuestionContainer]', error, {
        totalSteps,
        currentStep,
      });
      // debugger;
      handleFinishWorkout();
      memo.isGoingOut = true;
    }
  }, [memo, handleFinishWorkout, isExceed, currentStep, totalSteps]);

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
      <div
        className={cn(
          isDev && '__WorkoutQuestionContainer_Skeleton', // DEBUG
          'flex flex-col gap-4 py-2',
        )}
      >
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-8 w-full" />
        {/* Emulate answers */}
        <div className="grid gap-4 py-2 md:grid-cols-2">
          {generateArray(2).map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
        {/* Emulate buttons */}
        <div className="flex justify-center gap-4">
          {generateArray(2).map((i) => (
            <Skeleton key={i} className="h-10 w-28" />
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
      onFinish={handleFinishWorkout}
      onContinue={goToTheNextQuestion}
      goPrevQuestion={goToThePrevQuestion}
      selectedAnswerId={workout?.selectedAnswerId || undefined}
    />
  );
}
