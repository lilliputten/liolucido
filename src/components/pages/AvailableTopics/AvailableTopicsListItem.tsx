import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
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
  const topicsContext = useTopicsContext();
  const { routePath } = topicsContext;
  const router = useRouter();
  const pathname = usePathname();
  const topicRoutePath = `${routePath}/${id}`;
  const trainRoutePath = `/train/topic/${id}`;
  const isCurrentTopicRoutePath = comparePathsWithoutLocalePrefix(topicRoutePath, pathname);
  const startTraining = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    router.push(trainRoutePath);
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
        <TopicHeader topic={topic} className="flex-1 max-sm:flex-col-reverse" />
      </CardHeader>
      {!!description && (
        <CardContent
          className={cn(
            isDev && '__AvailableTopicsList_TopicItem_CardContent', // DEBUG
            'flex flex-1 flex-col',
          )}
        >
          <div id="description">
            {/* TODO: Format text */}
            {description}
          </div>
        </CardContent>
      )}
      <CardContent
        className={cn(
          isDev && '__AvailableTopicsList_TopicItem_CardContent', // DEBUG
          'flex flex-1 flex-wrap gap-4 text-xs md:items-end',
        )}
      >
        <TopicProperties topic={topic} className="flex-1 text-sm" showDates />
        <div id="right-actions" className="flex flex-wrap items-center gap-4">
          {allowedTraining && (
            <Button variant="theme" onClick={startTraining} className="flex gap-2">
              <Icons.arrowRight className="size-4" />
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
