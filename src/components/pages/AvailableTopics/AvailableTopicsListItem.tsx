import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useFormattedRelativeDate } from '@/lib/helpers/dates';
import { cn } from '@/lib/utils';
import { useSessionUser } from '@/hooks/useSessionUser';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { TopicHeader } from '@/features/topics/components/TopicHeader';
import { TopicProperties } from '@/features/topics/components/TopicProperties';
import { TTopic } from '@/features/topics/types';

interface TAvailableTopicsListItemProps {
  idx: number;
  topic: TTopic;
}

export function AvailableTopicsListItem(props: TAvailableTopicsListItemProps) {
  const { topic } = props;
  const {
    id,
    userId,
    name,
    description,
    isPublic,
    // langCode,
    // langName,
    // keywords,
    // createdAt,
    // updatedAt,
    _count,
  } = topic;
  const sessionUser = useSessionUser();
  const isOwner = userId && userId === sessionUser?.id;
  const questionsCount = _count?.questions;
  const allowedTraining = !!questionsCount;
  const topicsContext = useTopicsContext();
  const { routePath } = topicsContext;
  const PublicIcon = isPublic ? Icons.Eye : Icons.EyeOff;
  const router = useRouter();
  const topicRoutePath = `${routePath}/${id}`;
  const trainRoutePath = `/train/topic/${id}`;
  const startTraining = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    router.push(trainRoutePath);
  };
  const defaultAction = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    router.push(topicRoutePath);
  };
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
      onClick={defaultAction}
    >
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
            <Link
              onClick={startTraining}
              href={trainRoutePath}
              className={cn(buttonVariants({ variant: 'theme' }), 'flex gap-2')}
            >
              <Icons.arrowRight className="size-4" />
              <span>Start Training</span>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
