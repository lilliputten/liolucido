'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { TTopic } from '@/features/topics/types';

export interface TViewTopicContentActionsProps {
  topic: TTopic;
  isPending?: boolean;
  goBack?: (ev: React.MouseEvent) => void;
  handleDeleteTopic: () => void;
}

export function ViewTopicContentActions(props: TViewTopicContentActionsProps) {
  const { goBack, handleDeleteTopic } = props;
  return (
    <>
      <Button variant="ghost" size="sm" onClick={goBack} className="gap-2" disabled={!goBack}>
        <Icons.arrowLeft className="size-4" />
        <span>Back</span>
      </Button>
      <Button variant="destructive" size="sm" onClick={handleDeleteTopic} className="gap-2">
        <Icons.trash className="size-4" />
        <span>Delete</span>
      </Button>
      {/*
      <Button
        type="button"
        size="sm"
        variant={isSubmitEnabled ? 'success' : 'disable'}
        disabled={!isSubmitEnabled}
        className="gap-2"
        onClick={handleSubmit}
      >
        <Icon className={cn('size-4', isPending && 'animate-spin')} /> <span>{buttonText}</span>
      </Button>
      */}
    </>
  );
}
