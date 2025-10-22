import React from 'react';

import { generateArray } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { MarkdownText } from '@/components/ui/MarkdownText';
import { Progress } from '@/components/ui/Progress';
import { Skeleton } from '@/components/ui/Skeleton';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface WorkoutQuestionProps {
  questionText: string;
  answers: Answer[];
  isAnswersLoading?: boolean;
  currentStep: number;
  totalSteps: number;
  onAnswerSelect: (answerId: string) => void;
  onSkip: () => void;
  onFinish: () => void;
  onContinue: () => void;
  goPrevQuestion: () => void;
  selectedAnswerId?: string;
}

export function WorkoutQuestion({
  questionText,
  answers,
  isAnswersLoading,
  currentStep,
  totalSteps,
  onAnswerSelect,
  onSkip,
  onFinish,
  onContinue,
  goPrevQuestion,
  selectedAnswerId,
}: WorkoutQuestionProps) {
  const progressStep = selectedAnswerId ? currentStep : currentStep - 1;
  const progress = (progressStep / totalSteps) * 100;

  const isSelectedCorrect =
    !!selectedAnswerId && answers.find(({ id }) => id === selectedAnswerId)?.isCorrect;

  const isFinished = currentStep >= totalSteps;

  const answersContent = isAnswersLoading ? (
    // Emulate answers...
    generateArray(2).map((i) => <Skeleton key={i} className="h-14 w-full" />)
  ) : !answers.length ? (
    <p className="opacity-50">No answers created here. Just skip it.</p>
  ) : (
    answers.map((answer) => {
      const isSelected = selectedAnswerId === answer.id;
      const isCorrect = answer.isCorrect;
      let borderColor = 'border-border';
      let bgColor = 'bg-background/50';
      if (selectedAnswerId) {
        if (isCorrect) {
          borderColor = isSelected ? 'border-green-500' : 'border-green-500 border-dashed';
          bgColor = isSelected ? 'bg-green-500/20' : 'bg-green-500/5';
        } else if (isSelected) {
          borderColor = 'border-red-500';
          bgColor = 'bg-red-500/20';
        }
      }
      return (
        <button
          key={answer.id}
          onClick={() => !selectedAnswerId && onAnswerSelect(answer.id)}
          disabled={!!selectedAnswerId}
          className={cn(
            isDev && '__WorkoutQuestion_Answer',
            'w-full rounded-lg border p-4 text-left transition',
            'hover:bg-theme-500/15 hover:text-accent-foreground',
            'disabled:cursor-not-allowed',
            selectedAnswerId && 'disabled',
            borderColor,
            bgColor,
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <MarkdownText omitLinks>{answer.text}</MarkdownText>
            </div>
            {!!selectedAnswerId && (
              <div className="ml-2 flex-shrink-0">
                {isCorrect ? (
                  <Icons.CheckIcon className="size-5 text-green-500" />
                ) : isSelected ? (
                  <Icons.XIcon className="size-5 text-red-500" />
                ) : null}
              </div>
            )}
          </div>
        </button>
      );
    })
  );

  const progressBar = (
    <div data-testid="__WorkoutQuestion_Progress" className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>
          Question {currentStep} of {totalSteps}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2 bg-theme-500/20 transition" />
    </div>
  );

  const questionContent = (
    <div data-testid="__WorkoutQuestion_Question" className="flex flex-col gap-4">
      <div className="text-xl font-semibold">
        <MarkdownText>{questionText}</MarkdownText>
      </div>
      {/* Answers */}
      <div
        data-testid="__WorkoutQuestion_Answers"
        className={cn(
          isDev && '__WorkoutQuestion_Answers', // DEBUG
          'grid md:grid-cols-2',
          'gap-4 py-2',
        )}
      >
        {answersContent}
      </div>
    </div>
  );

  const buttonsContent = (
    <div className="flex justify-center gap-2">
      {/* Back Button */}
      {currentStep > 1 && (
        <Button
          data-testid="__WorkoutQuestion_Skip_Button"
          className={cn(
            'gap-2',
            // selectedAnswerId && 'disabled',
          )}
          variant="ghost"
          onClick={goPrevQuestion}
        >
          <Icons.ArrowLeft className="size-5 opacity-50" />
          Back
        </Button>
      )}
      {!isFinished &&
        (selectedAnswerId ? (
          <Button
            data-testid="__WorkoutQuestion_Skip_Button"
            className={cn(isSelectedCorrect && 'animate-pulse', 'gap-2')}
            variant="theme"
            onClick={onContinue}
          >
            <Icons.ArrowRight className="size-5 opacity-50" />
            Continue
          </Button>
        ) : (
          <>
            {/* Skip Button */}
            {!selectedAnswerId /* && currentStep < totalSteps */ && (
              <Button
                data-testid="__WorkoutQuestion_Skip_Button"
                className="gap-2"
                variant="ghost"
                onClick={onSkip}
              >
                <Icons.ArrowRight className="size-5 opacity-50" />
                Skip
              </Button>
            )}
          </>
        ))}
      {/* Finish Button */}
      <Button
        data-testid="__WorkoutQuestion_Finish_Button"
        className={cn(
          'gap-2',
          isFinished && selectedAnswerId && isSelectedCorrect && 'animate-pulse',
          // selectedAnswerId && 'disabled',
        )}
        variant={isFinished && selectedAnswerId ? 'theme' : 'ghost'}
        onClick={onFinish}
      >
        <Icons.Flag className="size-5 opacity-50" />
        Finish
      </Button>
    </div>
  );

  return (
    <div data-testid="__WorkoutQuestion" className="flex flex-col gap-4">
      {progressBar}
      {questionContent}
      {buttonsContent}
    </div>
  );
}
