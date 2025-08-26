'use client';

import React from 'react';
import Link from 'next/link';

import { myTopicsRoute } from '@/config/routesConfig';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { TTopic } from '@/features/topics/types';
import { useSessionUser } from '@/hooks';

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
        <Icons.ArrowLeft className="hidden size-4 opacity-50 sm:flex" />
        <span>Back</span>
      </Button>
      {allowedTraining && (
        <Link
          href={`/topics/available/${id}/workout`}
          className={cn(buttonVariants({ variant: 'theme', size: 'sm' }), 'flex gap-2')}
        >
          <Icons.ArrowRight className="hidden size-4 opacity-50 sm:flex" />
          <span>Start Training</span>
        </Link>
      )}
      {allowedEdit && (
        <Link
          href={`${myTopicRoutePath}/${topic.id}`}
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'flex gap-2')}
        >
          <Icons.edit className="hidden size-4 opacity-50 sm:flex" />
          <span>Manage Topic</span>
        </Link>
      )}
    </>
  );
}
