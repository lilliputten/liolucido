'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { useTopicsContext } from '@/contexts/TopicsContext';
import { TTopic } from '@/features/topics/types';

export interface TViewTopicContentActionsProps {
  topic: TTopic;
  isPending?: boolean;
  goBack?: (ev: React.MouseEvent) => void;
  handleDeleteTopic: () => void;
}

export function ViewTopicContentActions(props: TViewTopicContentActionsProps) {
  const { topic, goBack, handleDeleteTopic } = props;
  const router = useRouter();
  const topicsContext = useTopicsContext();
  return (
    <>
      <Button variant="ghost" size="sm" onClick={goBack} className="gap-2" disabled={!goBack}>
        <Icons.arrowLeft className="size-4" />
        <span>Back</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`${topicsContext.routePath}/${topic.id}/edit`)}
        className="gap-2"
      >
        <Icons.edit className="size-4" />
        <span>Edit</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`${topicsContext.routePath}/${topic.id}/questions`)}
        className="gap-2"
      >
        <Icons.questions className="size-4" />
        <span>Questions</span>
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
