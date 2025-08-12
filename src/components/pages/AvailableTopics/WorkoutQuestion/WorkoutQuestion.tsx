import React from 'react';
import { CheckIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { isDev } from '@/constants';

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface WorkoutQuestionProps {
  questionText: string;
  answers: Answer[];
  currentStep: number;
  totalSteps: number;
  onAnswerSelect: (answerId: string, isCorrect: boolean) => void;
  onSkip: () => void;
  selectedAnswerId?: string;
  showResults?: boolean;
}

export function WorkoutQuestion({
  questionText,
  answers,
  currentStep,
  totalSteps,
  onAnswerSelect,
  onSkip,
  selectedAnswerId,
  showResults = false,
}: WorkoutQuestionProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn(isDev && '__WorkoutQuestion', 'flex flex-col gap-6')}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Question {currentStep} of {totalSteps}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{questionText}</h2>

        {/* Answers */}
        <div className="space-y-3">
          {!answers.length && <p className="opacity-50">No answers created here. Just skip it.</p>}
          {answers.map((answer) => {
            const isSelected = selectedAnswerId === answer.id;
            const isCorrect = answer.isCorrect;
            let borderColor = 'border-border';
            let bgColor = 'bg-card';
            if (showResults) {
              if (isCorrect) {
                borderColor = 'border-green-500';
                bgColor = 'bg-green-50 dark:bg-green-950';
              } else if (isSelected) {
                borderColor = 'border-red-500';
                bgColor = 'bg-red-50 dark:bg-red-950';
              }
            }
            return (
              <button
                key={answer.id}
                onClick={() => !showResults && onAnswerSelect(answer.id, isCorrect)}
                disabled={showResults}
                className={cn(
                  isDev && '__WorkoutQuestion_Answer',
                  'w-full rounded-lg border-2 p-4 text-left transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'disabled:cursor-not-allowed',
                  borderColor,
                  bgColor,
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{answer.text}</span>
                  {showResults && (
                    <div className="ml-2 flex-shrink-0">
                      {isCorrect ? (
                        <CheckIcon className="h-5 w-5 text-green-600" />
                      ) : isSelected ? (
                        <XIcon className="h-5 w-5 text-red-600" />
                      ) : null}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skip Button */}
      {!showResults && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={onSkip}>
            Skip
          </Button>
        </div>
      )}
    </div>
  );
}
