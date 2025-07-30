'use client';

import React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { PageError } from '@/components/shared/PageError';
import { isDev } from '@/constants';
import { useQuestionsContext } from '@/contexts/QuestionsContext';

// Error boundaries must be Client Components
// @see https://nextjs.org/docs/app/getting-started/error-handling

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const questionsContext = useQuestionsContext();
  const { routePath, topicRootRoutePath } = questionsContext;
  const extraActions = (
    <>
      {topicRootRoutePath && (
        <Link
          href={topicRootRoutePath}
          className={cn(buttonVariants({ variant: 'default' }), 'flex gap-2')}
        >
          <Icons.arrowLeft className="size-4" />
          <span>To the topic</span>
        </Link>
      )}
      {routePath && (
        <Link href={routePath} className={cn(buttonVariants({ variant: 'default' }), 'flex gap-2')}>
          <Icons.arrowLeft className="size-4" />
          <span>To the questions list</span>
        </Link>
      )}
    </>
  );
  return (
    <PageError
      className={cn(
        isDev && '__questions_error', // DEBUG
      )}
      error={error}
      reset={reset}
      extraActions={extraActions}
    />
  );
}
