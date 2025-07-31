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
  const { topics } = useTopicsContext();

  const goBack = useGoBack(rootRoute);

  const hasTopics = !!topics.length;

  if (!hasTopics) {
    return (
      <PageEmpty
        className="size-full flex-1"
        title="No topics have been created yet"
        description="You dont have any topics yet. Add any topic to your profile."
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
              <span>Manage your own topics</span>
            </Link>
          </>
        }
      />
    );
  }

  return (
    <AvailableTopicsList
      className={cn(
        isDev && '__AvailableTopicsListWrapper_Card', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
      )}
      topics={topics}
    />
  );
}
