'use client';

import React from 'react';

import { useQuestionsContext } from '@/contexts/QuestionsContext';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { TAnswerData } from '@/features/answers/types';

import { WorkoutQuestion } from './WorkoutQuestion';

export function WorkoutQuestionContainer() {
  const { workout, saveQuestionResultAndGoTheTheNext } = useWorkoutContext();
  const { questions } = useQuestionsContext();
  const [answers, setAnswers] = React.useState<TAnswerData[]>([]);
  const [isPending, startTransition] = React.useTransition();
  const [selectedAnswerId, setSelectedAnswerId] = React.useState<string>();
  const [showResults, setShowResults] = React.useState(false);

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

  const handleAnswerSelect = React.useCallback(
    (answerId: string, isCorrect: boolean) => {
      setSelectedAnswerId(answerId);
      setShowResults(true);

      // Update workout with result and move to next question
      const result = isCorrect ? '1' : '0';
      saveQuestionResultAndGoTheTheNext(result);

      // Auto-advance after delay
      setTimeout(() => {
        setShowResults(false);
        setSelectedAnswerId(undefined);
      }, 1500);
    },
    [saveQuestionResultAndGoTheTheNext],
  );

  const handleSkip = React.useCallback(() => {
    // Update workout with skip result and move to next question
    saveQuestionResultAndGoTheTheNext?.('0');
  }, [saveQuestionResultAndGoTheTheNext]);

  if (isPending) {
    return <div className="p-6">Loading question...</div>;
  }

  if (!workout) {
    return <div className="p-6">No active workout found.</div>;
  }

  if (!question) {
    return <div className="p-6">Question not found.</div>;
  }

  const questionsOrder = (workout.questionsOrder || '').split(' ');
  const currentStep = (workout.stepIndex || 0) + 1;
  const totalSteps = questionsOrder.length;

  return (
    <WorkoutQuestion
      questionText={question.text}
      answers={answers}
      currentStep={currentStep}
      totalSteps={totalSteps}
      onAnswerSelect={handleAnswerSelect}
      onSkip={handleSkip}
      selectedAnswerId={selectedAnswerId}
      showResults={showResults}
    />
  );
}
