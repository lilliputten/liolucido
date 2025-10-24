'use client';

import React from 'react';

import { availableTopicsRoute, myTopicsRoute } from '@/config/routesConfig';
import { truncateMarkdown } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useWorkoutQuery } from '@/hooks/react-query/useWorkoutQuery';
import { Card } from '@/components/ui/Card';
import { TActionMenuItem } from '@/components/dashboard/DashboardActions';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { TopicsManageScopeIds, topicsRoutes } from '@/contexts/TopicsContext';
import { useTopicsBreadcrumbsItems } from '@/features/topics/components/TopicsBreadcrumbs';
import { TTopic } from '@/features/topics/types';
import { useGoBack, useGoToTheRoute, useSessionUser } from '@/hooks';

import { ViewAvailableTopicContent } from './ViewAvailableTopicContent';

interface TViewAvailableTopicProps {
  topic: TTopic;
}

const manageScope = TopicsManageScopeIds.AVAILABLE_TOPICS;
const routePath = topicsRoutes[manageScope];

export function ViewAvailableTopic(props: TViewAvailableTopicProps) {
  const { topic } = props;

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(routePath);

  // Get workout data for this topic
  const workoutQuery = useWorkoutQuery({ topicId: topic.id, userId: undefined });
  const { workout, questionIds } = workoutQuery;
  const questionsCount = questionIds?.length || 0;
  const allowedTraining = !!questionsCount;
  const _isWorkoutInProgress = workout?.started && !workout?.finished;

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
        id: 'StartTraining',
        content: workout?.finished
          ? 'Restart Training'
          : workout?.started
            ? 'Resume Training'
            : 'Start Training',
        variant: 'theme',
        icon: Icons.Activity,
        visibleFor: 'sm',
        hidden: !allowedTraining,
        onClick: () => goToTheRoute(`${availableTopicsRoute}/${id}/workout`),
      },
      {
        id: 'ReviewTraining',
        content: 'Review Training',
        variant: 'ghost',
        icon: Icons.LineChart,
        visibleFor: 'lg',
        hidden: !allowedTraining || !workout,
        onClick: () => goToTheRoute(`${availableTopicsRoute}/${id}/workout`),
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
    ],
    [allowedEdit, allowedTraining, goBack, goToTheRoute, id, workout],
  );

  const breadcrumbs = useTopicsBreadcrumbsItems({
    scope: manageScope,
    topic: topic,
  });

  return (
    <>
      <DashboardHeader
        heading={truncateMarkdown(topic.name, 100)}
        className={cn(
          isDev && '__ViewAvailableTopic_DashboardHeader', // DEBUG
          'mx-6',
        )}
        actions={actions}
        breadcrumbs={breadcrumbs}
        inactiveLastBreadcrumb
      />
      <Card
        className={cn(
          isDev && '__ViewAvailableTopic_Card', // DEBUG
          'relative mx-6 flex flex-1 flex-col overflow-hidden xl:col-span-2',
        )}
      >
        <ViewAvailableTopicContent topic={topic} />
      </Card>
    </>
  );
}
