'use client';

import React from 'react';

import { myTopicsRoute } from '@/config/routesConfig';
import { generateArray } from '@/lib/helpers';
import { TPropsWithClassName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { TActionMenuItem } from '@/components/dashboard/DashboardActions';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { TopicsManageScopeIds, topicsRoutes } from '@/contexts/TopicsContext';
import { useWorkoutContext } from '@/contexts/WorkoutContext';
import { TopicHeader } from '@/features/topics/components/TopicHeader';
import { TopicProperties } from '@/features/topics/components/TopicProperties';
import { useTopicsBreadcrumbsItems } from '@/features/topics/components/TopicsBreadcrumbs';
import { useAvailableTopicById, useGoBack, useGoToTheRoute, useSessionUser } from '@/hooks';

import { WorkoutTopicContent } from './WorkoutTopicContent';

export function WorkoutTopic(props: TPropsWithClassName) {
  const { className } = props;
  const manageScope = TopicsManageScopeIds.AVAILABLE_TOPICS;
  const { topicId } = useWorkoutContext();
  const routePath = topicsRoutes[manageScope];

  if (!topicId) {
    throw new Error('No workout topic ID specified');
  }

  const availableTopicQuery = useAvailableTopicById({ id: topicId });
  const { topic, isLoading: isTopicLoading, isFetched: isTopicFetched } = availableTopicQuery;
  const isTopicPending = isTopicLoading && !isTopicFetched;

  // const {
  //   id,
  //   userId,
  //   // name,
  //   // description,
  //   // isPublic,
  //   // langCode,
  //   // langName,
  //   // keywords,
  //   // createdAt,
  //   // updatedAt,
  //   // _count,
  // } = topic;

  const user = useSessionUser();
  const isOwner = topic?.userId && topic?.userId === user?.id;
  const isAdminMode = user?.role === 'ADMIN';
  const allowedEdit = isAdminMode || isOwner;
  // const questionsCount = _count?.questions;
  // const allowedTraining = !!questionsCount;

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(`${routePath}/${topicId}`); // topicsContext.routePath);

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
        onClick: () => goToTheRoute(`${myTopicsRoute}/${topicId}`),
      },
    ],
    [allowedEdit, goBack, goToTheRoute, topicId],
  );

  const breadcrumbs = useTopicsBreadcrumbsItems({
    scope: manageScope,
    topic: topic,
    lastItem: {
      content: 'Workout Review',
      // link: isWorkoutInProgress ? questionsContext.routePath : undefined,
    },
  });

  const content =
    isTopicPending || !topic ? (
      <div
        className={cn(
          isDev && '__WorkoutTopic_Card_Skeleton', // DEBUG
          'grid w-full gap-4 p-4 md:grid-cols-2',
        )}
      >
        {generateArray(5).map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    ) : (
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
            'item-start flex flex-col gap-4',
          )}
        >
          <TopicHeader
            scope={TopicsManageScopeIds.AVAILABLE_TOPICS}
            topic={topic}
            className="flex-1 max-sm:flex-col-reverse"
            showDescription
          />
          <TopicProperties topic={topic} className="flex-1 text-sm" showDates />
        </CardHeader>
        <CardContent
          className={cn(
            isDev && '__WorkoutTopic_Content', // DEBUG
            'relative flex flex-1 flex-col overflow-hidden px-0',
          )}
        >
          <WorkoutTopicContent topicId={topicId} />
        </CardContent>
      </Card>
    );

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
      {content}
    </>
  );
}
