'use client';

import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';
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
    finishWorkout,
    goNextQuestion,
    goPrevQuestion,
  } = useWorkoutContext();
  const { questions } = useQuestionsContext();
  const [answers, setAnswers] = React.useState<TAnswerData[]>([]);
  const [isPending, startTransition] = React.useTransition();
  const [selectedAnswerId, setSelectedAnswerId] = React.useState<string>();

  React.useEffect(() => {
    setSelectedAnswerId(undefined);
  }, [workout?.stepIndex]);

  const memo = React.useMemo<TMemo>(() => ({}), []);

  const currentQuestionId = React.useMemo(() => {
    if (!workout?.questionsOrder) return null;
    const questionsOrder = workout.questionsOrder.split(' ');
    const currentIndex = workout.stepIndex || 0;
    return questionsOrder[currentIndex] || null;
  }, [workout?.questionsOrder, workout?.stepIndex]);

  const question = React.useMemo(() => {
    if (!currentQuestionId || !questions) return null;
    return questions.find((q) => q.id === currentQuestionId) || null;
  }, [currentQuestionId, questions]);

  // Fetch answers
  React.useEffect(() => {
    if (!question) return;
    startTransition(async () => {
      // Fetch answers
      try {
        const answersResponse = await fetch(`/api/questions/${question.id}/answers`);
        if (answersResponse.ok) {
          const answersData = await answersResponse.json();
          setAnswers(answersData);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch answers:', error);
        debugger; // eslint-disable-line no-debugger
      }
    });
  }, [question, startTransition]);

  const goToTheNextQuestion = React.useCallback(() => {
    if (memo.nextPageTimerHandler) {
      clearTimeout(memo.nextPageTimerHandler);
      memo.nextPageTimerHandler = undefined;
    }
    // setSelectedAnswerId(undefined);
    goNextQuestion();
  }, [memo, goNextQuestion]);

  const goToThePrevQuestion = React.useCallback(() => {
    goPrevQuestion();
    // setSelectedAnswerId(undefined);
  }, [goPrevQuestion]);

  const onAnswerSelect = React.useCallback(
    (answerId: string) => {
      setSelectedAnswerId(answerId);
      const answer = answers.find(({ id }) => id === answerId);
      if (answer) {
        const { isCorrect } = answer;
        // Update workout with result and move to next question
        saveResult(isCorrect);
        // Auto-advance after delay
        if (isCorrect) {
          memo.nextPageTimerHandler = setTimeout(goToTheNextQuestion, 2000);
        }
      }
    },
    [memo, answers, goToTheNextQuestion, saveResult],
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
            <Skeleton key={i} className="h-20 w-full" />
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
    return <div className="p-6">No active workout found.</div>;
  }

  const questionsOrder = (workout.questionsOrder || '').split(' ');
  const currentStep = (workout.stepIndex || 0) + 1;
  const totalSteps = questionsOrder.length;

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
