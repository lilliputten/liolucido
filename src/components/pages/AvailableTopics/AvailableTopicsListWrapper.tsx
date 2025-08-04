'use client';

import React from 'react';
import Link from 'next/link';

import { myTopicsRoute, rootRoute } from '@/config/routesConfig';
import { cn } from '@/lib/utils';
import { useGoBack } from '@/hooks/useGoBack';
import { Button, buttonVariants } from '@/components/ui/button';
import { PageEmpty } from '@/components/pages/shared';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';

import { AvailableTopicsList } from './AvailableTopicsList';

export function AvailableTopicsListWrapper() {
  const { totalCount } = useTopicsContext();

  const goBack = useGoBack(rootRoute);

  const hasTopics = !!totalCount;

  if (!hasTopics) {
    return (
      <PageEmpty
        className="size-full flex-1"
        title="No topics available"
        description="Change filters to allow displaying public topics (if there are any), or create your own ones."
        buttons={
          <>
            <Button variant="ghost" onClick={goBack} className="flex gap-2">
              <Icons.arrowLeft className="size-4" />
              Go Back
            </Button>
            <Link
              href={myTopicsRoute}
              className={cn(buttonVariants({ variant: 'default' }), 'flex gap-2')}
            >
              <Icons.topics className="size-4" />
              <span>Manage or create your own topics</span>
            </Link>
          </>
        }
      />
    );
  }

  // TODO: Add a toolbar with the "Add topic" toolbar (links to a login page for unauthorized user)
  return (
    <AvailableTopicsList
      className={cn(
        isDev && '__AvailableTopicsList', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
      )}
    />
  );
}
