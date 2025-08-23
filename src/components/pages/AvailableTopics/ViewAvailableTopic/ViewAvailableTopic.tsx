'use client';

import React from 'react';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { isDev } from '@/constants';
import { TopicsManageScopeIds, topicsRoutes } from '@/contexts/TopicsContext';
import { TopicsScopeBreadcrumbs } from '@/features/topics/components/TopicsBreadcrumbs';
import { TTopic } from '@/features/topics/types';
import { useGoBack } from '@/hooks';

import { ViewAvailableTopicContent } from './ViewAvailableTopicContent';
import { ViewAvailableTopicContentActions } from './ViewAvailableTopicContentActions';

interface TViewAvailableTopicProps extends TPropsWithClassName {
  topic: TTopic;
}

export function ViewAvailableTopic(props: TViewAvailableTopicProps) {
  const manageScope = TopicsManageScopeIds.AVAILABLE_TOPICS;
  const { className, topic } = props;
  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const routePath = topicsRoutes[manageScope];
  const goBack = useGoBack(routePath);

  return (
    <Card
      className={cn(
        isDev && '__ViewAvailableTopic', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__ViewAvailableTopic_Header', // DEBUG
          'item-start flex flex-col gap-4 md:flex-row',
        )}
      >
        <div
          className={cn(
            isDev && '__EditTopicCard_TitleWrapper', // DEBUG
            'flex flex-1 flex-col justify-center gap-2 overflow-hidden',
          )}
        >
          <TopicsScopeBreadcrumbs
            className={cn(
              isDev && '__EditTopicCard_Breadcrumbs', // DEBUG
            )}
            scope={manageScope}
            topic={topic}
            inactiveLast
          />
          {/* // UNUSED: Title
            <CardTitle className="flex flex-1 items-center overflow-hidden">
              <span className="truncate">Show Topic</span>
            </CardTitle>
            */}
        </div>
        <div
          ref={toolbarPortalRef}
          className={cn(
            isDev && '__ViewAvailableTopic_Toolbar', // DEBUG
            'flex flex-wrap items-center gap-2',
          )}
        >
          <ViewAvailableTopicContentActions topic={topic} goBack={goBack} />
        </div>
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__ViewAvailableTopic_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <ViewAvailableTopicContent topic={topic} />
      </CardContent>
    </Card>
  );
}
