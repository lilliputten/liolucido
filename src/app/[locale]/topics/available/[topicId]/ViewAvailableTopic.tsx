'use client';

import React from 'react';

import { myTopicsRoute } from '@/config/routesConfig';
import { cn } from '@/lib/utils';
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

export function ViewAvailableTopic(props: TViewAvailableTopicProps) {
  const { topic } = props;
  const manageScope = TopicsManageScopeIds.AVAILABLE_TOPICS;
  const routePath = topicsRoutes[manageScope];

  const goToTheRoute = useGoToTheRoute();
  const goBack = useGoBack(routePath);

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

  const availableTopicsPath = '/topics/available';
  const myTopicRoutePath = myTopicsRoute;

  const actions: TActionMenuItem[] = React.useMemo(
    () => [
      {
        id: 'Back',
        content: 'Back',
        variant: 'ghost',
        icon: Icons.ArrowLeft,
        visibleFor: 'sm',
        disabled: !goBack,
        onClick: goBack,
      },
      {
        id: 'StartTraining',
        content: 'Start Training',
        variant: 'theme',
        icon: Icons.ArrowRight,
        visibleFor: 'lg',
        hidden: !allowedTraining,
        onClick: () => goToTheRoute(`${availableTopicsPath}/${id}/workout`),
      },
      {
        id: 'ManageTopic',
        content: 'Manage Topic',
        variant: 'ghost',
        icon: Icons.Edit,
        visibleFor: 'xl',
        hidden: !allowedEdit,
        onClick: () => goToTheRoute(`${myTopicRoutePath}/${id}`),
      },
    ],
    [allowedEdit, allowedTraining, goBack, goToTheRoute, id, myTopicRoutePath],
  );

  const breadcrumbs = useTopicsBreadcrumbsItems({
    scope: manageScope,
    topic: topic,
  });

  return (
    <>
      <DashboardHeader
        heading="View Available Topic"
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
          'relative mx-6 flex flex-1 flex-col overflow-hidden py-6 xl:col-span-2',
        )}
      >
        <ViewAvailableTopicContent topic={topic} />
      </Card>
    </>
  );
}
