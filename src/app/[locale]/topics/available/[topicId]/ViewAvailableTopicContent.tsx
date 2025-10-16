'use client';

import React from 'react';

import { availableTopicsRoute } from '@/config/routesConfig';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { DashboardActions, TActionMenuItem } from '@/components/dashboard/DashboardActions';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { TopicsManageScopeIds, topicsRoutes } from '@/contexts/TopicsContext';
import { TopicHeader } from '@/features/topics/components/TopicHeader';
import { TopicProperties } from '@/features/topics/components/TopicProperties';
import { TAvailableTopic } from '@/features/topics/types';
import { useGoBack, useGoToTheRoute, useSessionUser } from '@/hooks';

interface TViewAvailableTopicContentProps {
  topic: TAvailableTopic;
  className?: string;
}

// const manageScope = TopicsManageScopeIds.AVAILABLE_TOPICS;
// const routePath = topicsRoutes[manageScope];

export function ViewAvailableTopicContent(props: TViewAvailableTopicContentProps) {
  const manageScope = TopicsManageScopeIds.AVAILABLE_TOPICS;
  const { topic, className } = props;
  // Topic
  const {
    id,
    // userId,
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

  // const user = useSessionUser();
  // const isOwner = userId && userId === user?.id;
  // const isAdminMode = user?.role === 'ADMIN';
  // const allowedEdit = isAdminMode || isOwner;
  const questionsCount = _count?.questions;
  const allowedTraining = !!questionsCount;

  const goToTheRoute = useGoToTheRoute();
  // const goBack = useGoBack(routePath);

  const extraActions = React.useMemo<TActionMenuItem[]>(
    () => [
      {
        id: 'Workout',
        content: 'Workout',
        variant: 'theme',
        icon: Icons.Activity,
        visibleFor: 'sm',
        hidden: !allowedTraining,
        onClick: () => goToTheRoute(`${availableTopicsRoute}/${id}/workout`),
      },
    ],
    [allowedTraining, goToTheRoute, id],
  );

  return (
    <div
      className={cn(
        isDev && '__ViewAvailableTopicContent', // DEBUG
        'flex w-full flex-col gap-4 overflow-hidden',
        className,
      )}
    >
      <ScrollArea>
        <div
          className={cn(
            isDev && '__ViewAvailableTopicContent_Scroll', // DEBUG
            'flex w-full flex-col gap-4 overflow-hidden',
            'mx-6',
            className,
          )}
        >
          <TopicHeader
            scope={manageScope}
            topic={topic}
            showDescription
            className="flex-1 max-sm:flex-col-reverse"
          />
          <TopicProperties topic={topic} className="flex-1 text-sm" showDates />
          {/* TODO: Show statistics, existed workout etc */}
          <DashboardActions actions={extraActions} />
        </div>
      </ScrollArea>
    </div>
  );
}
