'use client';

import React from 'react';
import Link from 'next/link';

import { myTopicsRoute, rootRoute } from '@/config/routesConfig';
import { cn } from '@/lib/utils';
import { useAvailableTopicsByScope } from '@/hooks/useAvailableTopics';
import { useGoBack } from '@/hooks/useGoBack';
import { Button, buttonVariants } from '@/components/ui/button';
import { PageEmpty } from '@/components/pages/shared';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { TopicsManageScopeIds } from '@/contexts/TopicsContext';

import { AvailableTopicsList } from './AvailableTopicsList';
import { AvailableTopicsLoading } from './AvailableTopicsLoading';

export function AvailableTopicsListWrapper() {
  const goBack = useGoBack(rootRoute);
  const manageScope = TopicsManageScopeIds.AVAILABLE_TOPICS;

  const availableTopics = useAvailableTopicsByScope({ manageScope });
  const { isLoading, isError, hasTopics } = availableTopics;

  if (isLoading) {
    return <AvailableTopicsLoading />;
  }

  if (isError) {
    return (
      <PageEmpty
        className="size-full flex-1"
        title="Something went wrong"
        description="We couldn't load the topics. Please try again later."
        buttons={
          <>
            <Button variant="ghost" onClick={goBack} className="flex gap-2">
              <Icons.ArrowLeft className="hidden size-4 opacity-50 sm:flex" />
              Go Back
            </Button>
          </>
        }
      />
    );
  }

  if (!hasTopics) {
    return (
      <PageEmpty
        className="size-full flex-1"
        title="No topics available"
        description="Change filters to allow displaying public topics (if there are any), or create your own ones."
        buttons={
          <>
            <Button variant="ghost" onClick={goBack} className="flex gap-2">
              <Icons.ArrowLeft className="hidden size-4 opacity-50 sm:flex" />
              Go Back
            </Button>
            <Link
              href={myTopicsRoute}
              className={cn(buttonVariants({ variant: 'default' }), 'flex gap-2')}
            >
              <Icons.topics className="hidden size-4 opacity-50 sm:flex" />
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
