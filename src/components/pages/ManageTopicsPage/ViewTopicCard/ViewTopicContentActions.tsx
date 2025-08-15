'use client';

import React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { useTopicsContext } from '@/contexts/TopicsContext';
import { TTopic } from '@/features/topics/types';

export interface TViewTopicContentActionsProps {
  topic: TTopic;
  isPending?: boolean;
  goBack?: (ev: React.MouseEvent) => void;
  handleDeleteTopic: () => void;
  handleAddQuestion?: () => void;
}

export function ViewTopicContentActions(props: TViewTopicContentActionsProps) {
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
  // const router = useRouter();
  const topicsContext = useTopicsContext();
  return (
    <>
      <Button variant="ghost" size="sm" onClick={goBack} className="gap-2" disabled={!goBack}>
        <Icons.ArrowLeft className="size-4" />
        <span>Back</span>
      </Button>
      <Link
        href={`${topicsContext.routePath}/${topic.id}/edit`}
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'flex gap-2')}
      >
        <Icons.edit className="size-4" />
        <span>Edit</span>
      </Link>
      <Link
        href={`${topicsContext.routePath}/${topic.id}/questions`}
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'flex gap-2')}
      >
        <Icons.questions className="size-4" />
        <span>Questions</span>
      </Link>
      {allowedTraining && (
        <Link
          href={`/topics/available/${id}/workout`}
          className={cn(buttonVariants({ variant: 'theme', size: 'sm' }), 'flex gap-2')}
        >
          <Icons.ArrowRight className="size-4" />
          <span>Start Training</span>
        </Link>
      )}
      {handleAddQuestion && (
        <Button variant="ghost" size="sm" onClick={handleAddQuestion} className="flex gap-2">
          <Icons.add className="size-4" />
          Add New Question
        </Button>
      )}
      <Button variant="destructive" size="sm" onClick={handleDeleteTopic} className="gap-2">
        <Icons.trash className="size-4" />
        <span>Delete Topic</span>
      </Button>
    </>
  );
}
