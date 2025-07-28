'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useAnswersContext } from '@/contexts/AnswersContext';
import { TAnswerId } from '@/features/answers/types';

import { PageEmpty } from '../shared';
import { ManageTopicQuestionAnswersListCard } from './ManageTopicQuestionAnswersListCard';

interface TAnswersListProps {
  topicId: string;
  openAddAnswerModal: () => void;
  openDeleteAnswerModal: (answerId: TAnswerId) => void;
  openEditAnswerCard: (answerId: TAnswerId) => void;
}

export function ManageTopicQuestionAnswersListWrapper(props: TAnswersListProps) {
  const { openAddAnswerModal, openDeleteAnswerModal, openEditAnswerCard } = props;
  const { answers } = useAnswersContext();

  const hasAnswers = !!answers.length;

  const router = useRouter();
  const answersContext = useAnswersContext();
  const goBack = React.useCallback(() => {
    const { href } = window.location;
    router.back();
    setTimeout(() => {
      // If still on the same page after trying to go back, fallback
      if (document.visibilityState === 'visible' && href === window.location.href) {
        router.push(answersContext.topicsListRoutePath);
      }
    }, 200);
  }, [router, answersContext]);

  return (
    <div
      className={cn(
        isDev && '__ManageTopicQuestionAnswersListWrapper', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
      )}
    >
      {hasAnswers ? (
        <ManageTopicQuestionAnswersListCard
          className={cn(
            isDev && '__ManageTopicQuestionAnswersListWrapper_Card', // DEBUG
            'relative flex flex-1 flex-col overflow-hidden',
          )}
          answers={answers}
          handleDeleteAnswer={openDeleteAnswerModal}
          handleEditAnswer={openEditAnswerCard}
          handleAddAnswer={openAddAnswerModal}
        />
      ) : (
        <PageEmpty
          className="size-full flex-1"
          iconName="answers"
          title="No answers have been created yet"
          description="You dont have any answers yet. Add any answer to your profile."
          buttons={
            <>
              <Button onClick={goBack} className="flex gap-2">
                <Icons.arrowLeft className="size-4" />
                Go Back
              </Button>
              <Button onClick={openAddAnswerModal} className="flex gap-2">
                <Icons.add className="size-4" />
                Add Answer
              </Button>
            </>
          }
        />
      )}
    </div>
  );
}
