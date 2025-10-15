'use client';

import React from 'react';

import { myTopicsRoute } from '@/config/routesConfig';
import { TPropsWithClassName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { TActionMenuItem } from '@/components/dashboard/DashboardActions';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { TopicsManageScopeIds, topicsRoutes } from '@/contexts/TopicsContext';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { TopicHeader } from '@/features/topics/components/TopicHeader';
import { TopicProperties } from '@/features/topics/components/TopicProperties';
import { useTopicsBreadcrumbsItems } from '@/features/topics/components/TopicsBreadcrumbs';
import { useGoBack, useGoToTheRoute, useSessionUser } from '@/hooks';

import { WorkoutTopicContent } from './WorkoutTopicContent';

export function WorkoutTopic(props: TPropsWithClassName) {
  const { className } = props;
  const manageScope = TopicsManageScopeIds.AVAILABLE_TOPICS;
  const { topic } = useWorkoutContext();
  const routePath = topicsRoutes[manageScope];

  if (!topic) {
    throw new Error('No topic found');
  }

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
    // _count,
  } = topic;

  const user = useSessionUser();
  const isOwner = userId && userId === user?.id;
  const isAdminMode = user?.role === 'ADMIN';
  const allowedEdit = isAdminMode || isOwner;
  // const questionsCount = _count?.questions;
  // const allowedTraining = !!questionsCount;

  const { workout } = useWorkoutContext();

  const currentQuestionId = React.useMemo(() => {
    if (!workout?.questionsOrder) return null;
    const questionsOrder = workout.questionsOrder.split(' ');
    const currentIndex = workout.stepIndex || 0;
    return questionsOrder[currentIndex] || null;
  }, [workout?.questionsOrder, workout?.stepIndex]);

  // const isWorkoutActive = workout?.started && !workout.finished;

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(`${routePath}/${topic.id}`); // topicsContext.routePath);

  const actions: TActionMenuItem[] = React.useMemo(
    () => [
      {
        id: 'Back',
        content: 'Back',
        variant: 'ghost',
        icon: Icons.ArrowLeft,
        visibleFor: 'sm',
        onClick: goBack,
      },
      {
        id: 'ManageTopic',
        content: 'Manage Topic',
        variant: 'ghost',
        icon: Icons.Edit,
        visibleFor: 'xl',
        hidden: !allowedEdit,
        onClick: () => goToTheRoute(`${myTopicsRoute}/${id}`),
      },
      {
        id: 'ManageQuestion',
        content: 'Manage Active Question',
        variant: 'ghost',
        icon: Icons.Questions,
        visibleFor: 'xl',
        hidden: true, // !isWorkoutActive || !allowedEdit,
        onClick: () => goToTheRoute(`${myTopicsRoute}/${id}/questions/${currentQuestionId}`),
      },
    ],
    [allowedEdit, goBack, goToTheRoute, id, currentQuestionId],
  );

  const breadcrumbs = useTopicsBreadcrumbsItems({
    scope: manageScope,
    topic: topic,
    lastItem: {
      content: 'Workout Review',
      // link: isWorkoutActive ? questionsContext.routePath : undefined,
    },
  });

  return (
    <>
      <DashboardHeader
        heading="Workout Review"
        className={cn(
          isDev && '__WorkoutTopic_DashboardHeader', // DEBUG
          'mx-6',
        )}
        breadcrumbs={breadcrumbs}
        actions={actions}
      />
      <Card
        className={cn(
          isDev && '__WorkoutTopic_Card', // DEBUG
          // 'xl:col-span-2', // ???
          'relative mx-6 flex flex-1 flex-col overflow-hidden',
          className,
        )}
      >
        <CardHeader
          className={cn(
            isDev && '__WorkoutTopic_CardHeader', // DEBUG
            'item-start flex flex-col gap-4 md:flex-row',
          )}
        >
          <div
            className={cn(
              isDev && '__EditTopicCard_TitleWrapper', // DEBUG
              'flex flex-1 flex-col justify-center gap-4',
            )}
          >
            <TopicHeader
              scope={TopicsManageScopeIds.AVAILABLE_TOPICS}
              topic={topic}
              className="flex-1 max-sm:flex-col-reverse"
              showDescription
            />
            <TopicProperties topic={topic} className="flex-1 text-sm" showDates />
          </div>
        </CardHeader>
        <CardContent
          className={cn(
            isDev && '__WorkoutTopic_Content', // DEBUG
            'relative flex flex-1 flex-col overflow-hidden px-0',
          )}
        >
          <WorkoutTopicContent topic={topic} />
        </CardContent>
      </Card>
    </>
  );
}
