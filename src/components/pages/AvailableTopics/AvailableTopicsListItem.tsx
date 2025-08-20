import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useAvailableTopicsByScope } from '@/hooks/useAvailableTopics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MarkdownText } from '@/components/ui/MarkdownText';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { TopicsManageScopeIds } from '@/contexts/TopicsContext';
import { TopicHeader } from '@/features/topics/components/TopicHeader';
import { TopicProperties } from '@/features/topics/components/TopicProperties';
import { TTopic } from '@/features/topics/types';
import { comparePathsWithoutLocalePrefix } from '@/i18n/helpers';
import { usePathname } from '@/i18n/routing';

interface TAvailableTopicsListItemProps {
  index: number;
  style?: React.CSSProperties;
  topic: TTopic;
}

export function AvailableTopicsListItem(props: TAvailableTopicsListItemProps) {
  const manageScope = TopicsManageScopeIds.AVAILABLE_TOPICS;
  const { topic, style } = props;
  const {
    id,
    // userId,
    // name,
    description,
    // isPublic,
    // langCode,
    // langName,
    // keywords,
    // createdAt,
    // updatedAt,
    _count,
  } = topic;
  const questionsCount = _count?.questions;
  const allowedTraining = !!questionsCount;
  const { routePath } = useAvailableTopicsByScope({ manageScope });
  const router = useRouter();
  const pathname = usePathname();
  const topicRoutePath = `${routePath}/${id}`;
  const workoutRoutePath = `/topics/available/${id}/workout`;
  const isCurrentTopicRoutePath = comparePathsWithoutLocalePrefix(topicRoutePath, pathname);
  const startWorkout = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    router.push(workoutRoutePath);
  };
  /* const defaultAction = (ev: React.MouseEvent) => {
   *   ev.stopPropagation();
   *   router.push(topicRoutePath);
   * };
   */
  let cardContent = (
    <>
      <CardHeader
        className={cn(
          isDev && '__AvailableTopicsList_TopicItem_CardHeader', // DEBUG
          'flex flex-1 flex-row gap-2',
          'max-sm:flex-col-reverse',
        )}
      >
        <TopicHeader scope={manageScope} topic={topic} className="flex-1 max-sm:flex-col-reverse" />
      </CardHeader>
      {!!description && (
        <CardContent
          className={cn(
            isDev && '__AvailableTopicsList_TopicItem_CardContent_Description', // DEBUG
            'flex flex-1 flex-col',
          )}
        >
          <div id="description">
            <MarkdownText omitLinks>{description}</MarkdownText>
          </div>
        </CardContent>
      )}
      <CardContent
        className={cn(
          isDev && '__AvailableTopicsList_TopicItem_CardContent_Properties', // DEBUG
          'flex flex-1 flex-wrap gap-4 text-xs md:items-end',
        )}
      >
        <TopicProperties topic={topic} className="flex-1 text-sm" showDates />
        <div id="right-actions" className="flex flex-wrap items-center gap-4">
          {allowedTraining && (
            <Button variant="theme" onClick={startWorkout} className="flex gap-2">
              <Icons.ArrowRight className="hidden size-4 opacity-50 sm:flex" />
              <span>Start Training</span>
            </Button>
          )}
        </div>
      </CardContent>
    </>
  );
  if (!isCurrentTopicRoutePath) {
    cardContent = (
      <Link className="flex-1 text-xl font-medium" href={topicRoutePath}>
        {cardContent}
      </Link>
    );
  }
  return (
    <Card
      className={cn(
        isDev && '__AvailableTopicsList_TopicItem_Card', // DEBUG
        'relative flex flex-1 flex-col',
        'overflow-visible',
        'cursor-pointer border-0 transition',
        'bg-theme/10',
        'hover:bg-theme/15',
      )}
      // onClick={defaultAction}
      style={{
        ...style,
      }}
    >
      {cardContent}
    </Card>
  );
}
