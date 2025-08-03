'use client';

import React from 'react';
import Link from 'next/link';

import { myTopicsRoute } from '@/config/routesConfig';
import { cn } from '@/lib/utils';
import { useSessionUser } from '@/hooks/useSessionUser';
import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { TTopic } from '@/features/topics/types';

export interface TViewTopicContentActionsProps {
  topic: TTopic;
  isPending?: boolean;
  goBack?: (ev: React.MouseEvent) => void;
  handleDeleteTopic?: () => void;
  handleAddQuestion?: () => void;
}

export function ViewTopicContentActions(props: TViewTopicContentActionsProps) {
  const {
    topic,
    goBack,
    // handleDeleteTopic,
    // handleAddQuestion,
  } = props;
  const {
    id,
    userId,
    // name,
    // description,
    // isPublic,
    // langCode,
    // langName,
    // keywords,
    // createdAt,
    // updatedAt,
    _count,
  } = topic;
  const user = useSessionUser();
  const isOwner = userId && userId === user?.id;
  const isAdminMode = user?.role === 'ADMIN';
  const allowedEdit = isAdminMode || isOwner;
  const questionsCount = _count?.questions;
  const allowedTraining = !!questionsCount;
  const myTopicRoutePath = myTopicsRoute;
  return (
    <>
      <Button variant="ghost" size="sm" onClick={goBack} className="gap-2" disabled={!goBack}>
        <Icons.arrowLeft className="size-4" />
        <span>Back</span>
      </Button>
      {allowedTraining && (
        <Link
          href={`/train/topic/${id}`}
          className={cn(buttonVariants({ variant: 'theme', size: 'sm' }), 'flex gap-2')}
        >
          <Icons.arrowRight className="size-4" />
          <span>Start Training</span>
        </Link>
      )}
      {allowedEdit && (
        <Link
          href={`${myTopicRoutePath}/${topic.id}`}
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'flex gap-2')}
        >
          <Icons.edit className="size-4" />
          <span>Manage Topic</span>
        </Link>
      )}
      {/* XXX: Extra actins: are they necessary here?
      {allowedEdit && (
        <Link
          href={`${myTopicRoutePath}/${topic.id}/questions`}
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'flex gap-2')}
        >
          <Icons.questions className="size-4" />
          <span>Manage Questions</span>
        </Link>
      )}
      {handleAddQuestion && (
        <Button variant="ghost" size="sm" onClick={handleAddQuestion} className="flex gap-2">
          <Icons.add className="size-4" />
          Add Question
        </Button>
      )}
      <Button variant="destructive" size="sm" onClick={handleDeleteTopic} className="gap-2">
        <Icons.trash className="size-4" />
        <span>Delete Topic</span>
      </Button>
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
