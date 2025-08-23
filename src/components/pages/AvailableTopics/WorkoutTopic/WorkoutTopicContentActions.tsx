'use client';

import React from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { TTopic } from '@/features/topics/types';
import { useSessionUser } from '@/hooks';

export interface TWorkoutTopicContentActionsProps {
  topic: TTopic;
  goBack?: (ev: React.MouseEvent) => void;
}

export function WorkoutTopicContentActions(props: TWorkoutTopicContentActionsProps) {
  const { topic, goBack } = props;
  const user = useSessionUser();
  const { workout } = useWorkoutContext();

  const isOwner = user?.id === topic.userId;

  const currentQuestionId = React.useMemo(() => {
    if (!workout?.questionsOrder) return null;
    const questionsOrder = workout.questionsOrder.split(' ');
    const currentIndex = workout.stepIndex || 0;
    return questionsOrder[currentIndex] || null;
  }, [workout?.questionsOrder, workout?.stepIndex]);

  return (
    <>
      <Button variant="ghost" size="sm" onClick={goBack} className="flex gap-2" disabled={!goBack}>
        <Icons.ArrowLeft className="hidden size-4 opacity-50 sm:flex" />
        <span>Back</span>
      </Button>
      {isOwner && (
        <>
          <Button variant="ghost" size="sm">
            <Link href={`/topics/my/${topic.id}`} className="flex gap-2">
              <Icons.edit className="hidden size-4 opacity-50 sm:flex" />
              <span>Manage Topic</span>
            </Link>
          </Button>
          {workout?.started && !workout.finished && currentQuestionId && (
            <Button variant="ghost" size="sm">
              <Link
                href={`/topics/my/${topic.id}/questions/${currentQuestionId}`}
                className="flex gap-2"
              >
                <Icons.questions className="hidden size-4 opacity-50 sm:flex" />
                <span>Manage Question</span>
              </Link>
            </Button>
          )}
        </>
      )}
    </>
  );
}
