'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { TTopic } from '@/features/topics/types';

export interface TWorkoutTopicContentActionsProps {
  topic: TTopic;
  goBack?: (ev: React.MouseEvent) => void;
}

export function WorkoutTopicContentActions(props: TWorkoutTopicContentActionsProps) {
  const {
    // topic,
    goBack,
  } = props;
  return (
    <>
      <Button variant="ghost" size="sm" onClick={goBack} className="gap-2" disabled={!goBack}>
        <Icons.arrowLeft className="size-4" />
        <span>Back</span>
      </Button>
    </>
  );
}
