'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
  const router = useRouter();
  const toTopic = () => {
    router.push(topicRootRoutePath);
  };
  const toQuestionsList = () => {
    router.push(routePath);
  };
  const extraActions = (
    <>
      {topicRootRoutePath && (
        <Button onClick={toTopic} className="flex gap-2">
          <Icons.arrowLeft className="size-4" />
          <span>To the topic</span>
        </Button>
      )}
      {routePath && (
        <Button onClick={toQuestionsList} className="flex gap-2">
          <Icons.arrowLeft className="size-4" />
          <span>To the questions list</span>
        </Button>
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
