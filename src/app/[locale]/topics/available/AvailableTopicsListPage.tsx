'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { TActionMenuItem } from '@/components/dashboard/DashboardActions';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { useAvailableTopicsByScope, useGoToTheRoute, useSessionUser } from '@/hooks';

import { AvailableTopicsList } from './AvailableTopicsList';

interface TProps {
  availableTopicsQuery: ReturnType<typeof useAvailableTopicsByScope>;
  manageScope: TTopicsManageScopeId;
}

export function AvailableTopicsListPage(props: TProps) {
  const { availableTopicsQuery, manageScope } = props;

  const user = useSessionUser();
  const goToTheRoute = useGoToTheRoute();
  // const goBack = useGoBack(rootRoute);

  const actions: TActionMenuItem[] = React.useMemo(
    () => [
      {
        id: 'AddNewTopic',
        content: 'Manage Topics',
        variant: 'ghost',
        icon: Icons.Edit,
        visibleFor: 'md',
        hidden: !user?.id,
        onClick: () => goToTheRoute('/topics/my'),
      },
    ],
    [goToTheRoute, user],
  );

  // TODO: Add a toolbar with the "Add topic" toolbar (links to a login page for unauthorized user)
  return (
    <>
      <DashboardHeader
        heading="Available Topics"
        className={cn(
          isDev && '__AvailableTopicsListPage_DashboardHeader', // DEBUG
          'mx-6',
        )}
        // breadcrumbs={breadcrumbs}
        actions={actions}
      />
      <AvailableTopicsList
        className={cn(
          isDev && '__AvailableTopicsListPage_Content', // DEBUG
          'relative mx-6 flex flex-1 flex-col overflow-hidden',
        )}
        manageScope={manageScope}
        availableTopicsQuery={availableTopicsQuery}
      />
    </>
  );
}
