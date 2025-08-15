'use client';

import React from 'react';
import Link from 'next/link';

import { myTopicsRoute } from '@/config/routesConfig';
import { cn } from '@/lib/utils';
import { useSessionUser } from '@/hooks/useSessionUser';
import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { TTopic } from '@/features/topics/types';

export interface TViewAvailableTopicContentActionsProps {
  topic: TTopic;
  isPending?: boolean;
  goBack?: (ev: React.MouseEvent) => void;
}

export function ViewAvailableTopicContentActions(props: TViewAvailableTopicContentActionsProps) {
  const { topic, goBack } = props;
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
        <Icons.ArrowLeft className="size-4" />
        <span>Back</span>
      </Button>
      {allowedTraining && (
        <Link
          href={`/topics/available/${id}/workout`}
          className={cn(buttonVariants({ variant: 'theme', size: 'sm' }), 'flex gap-2')}
        >
          <Icons.ArrowRight className="size-4" />
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
    </>
  );
}
