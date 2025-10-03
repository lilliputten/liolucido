'use client';

import React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/Button';
import * as Icons from '@/components/shared/Icons';
import { TTopic } from '@/features/topics/types';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

export interface TViewTopicContentActionsProps {
  topic: TTopic;
  isPending?: boolean;
  goBack?: (ev: React.MouseEvent) => void;
  handleDeleteTopic: () => void;
  handleAddQuestion?: () => void;
}

export function ViewTopicContentActions(props: TViewTopicContentActionsProps) {
  const { manageScope } = useManageTopicsStore();
  const routePath = `/topics/${manageScope}`;
  const { topic, goBack, handleDeleteTopic, handleAddQuestion } = props;
  const {
    id,
    // userId,
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
  const questionsCount = _count?.questions;
  const allowedTraining = !!questionsCount;
  return (
    <>
      <Button variant="ghost" size="sm" onClick={goBack} className="gap-2" disabled={!goBack}>
        <Icons.ArrowLeft className="hidden size-4 opacity-50 sm:flex" />
        <span>Back</span>
      </Button>
      <Link
        href={`${routePath}/${topic.id}/edit`}
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'flex gap-2')}
      >
        <Icons.Edit className="hidden size-4 opacity-50 sm:flex" />
        <span>Edit</span>
      </Link>
      <Link
        href={`${routePath}/${topic.id}/questions`}
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'flex gap-2')}
      >
        <Icons.Questions className="hidden size-4 opacity-50 sm:flex" />
        <span>Questions</span>
      </Link>
      {allowedTraining && (
        <Link
          href={`/topics/available/${id}/workout`}
          className={cn(buttonVariants({ variant: 'theme', size: 'sm' }), 'flex gap-2')}
        >
          <Icons.ArrowRight className="hidden size-4 opacity-50 sm:flex" />
          <span>Start Training</span>
        </Link>
      )}
      {handleAddQuestion && (
        <Button variant="ghost" size="sm" onClick={handleAddQuestion} className="flex gap-2">
          <Icons.Add className="hidden size-4 opacity-50 sm:flex" />
          Add New Question
        </Button>
      )}
      <Button variant="destructive" size="sm" onClick={handleDeleteTopic} className="gap-2">
        <Icons.Trash className="hidden size-4 opacity-50 sm:flex" />
        <span>Delete Topic</span>
      </Button>
    </>
  );
}
