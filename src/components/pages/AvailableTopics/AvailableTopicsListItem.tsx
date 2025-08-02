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
    langCode,
    langName,
    keywords,
    createdAt,
    // updatedAt,
    _count,
  } = topic;
  const user = useSessionUser();
  const isOwner = userId && userId === user?.id;
  const questionsCount = _count?.questions;
  const allowedTraining = !!questionsCount;
  const topicsContext = useTopicsContext();
  const { routePath } = topicsContext;
  const createdAtFormatted = useFormattedRelativeDate(createdAt);
  const PublicIcon = isPublic ? Icons.Eye : Icons.EyeOff;
  const router = useRouter();
  const topicRoutePath = `${routePath}/${id}`;
  const trainRoutePath = `/train/topic/${id}`;
  const keywordsList = keywords
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const keywordsContent = keywordsList?.map((kw, idx) => (
    <span key={`${idx}-${kw}`} className="rounded-sm bg-theme-500/10 px-2">
      {kw}
    </span>
  ));
  const langContent = [
    langName && <span key="langName">{langName}</span>,
    langCode && (
      <span key="langCode" className="opacity-50">
        ({langCode})
      </span>
    ),
  ].filter(Boolean);
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
        <div id="left-name" className="flex flex-1 flex-col gap-2">
          <div id="name">
            <Link className="flex-1 text-xl font-medium" href={topicRoutePath}>
              {name}
            </Link>
          </div>
        </div>
        <div id="right-tools" className="!mt-0 flex items-center gap-4 text-xs opacity-50">
          {isOwner && (
            <span id="isOwner" title="Your Topic">
              <Icons.ShieldCheck className="size-4 text-green-500" />
            </span>
          )}
          {isPublic && (
            <span id="isPublic" title={isPublic ? 'Public' : 'Private'}>
              <PublicIcon className="size-4" />
            </span>
          )}
          <span id="createdAt" title="Creation Date">
            {createdAtFormatted}
          </span>
        </div>
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
        <div id="left-props" className="flex flex-1 flex-wrap items-center gap-4">
          {!!questionsCount && (
            <span id="questions" className="flex items-center gap-1" title="Questions count">
              <Icons.questions className="mr-1 size-4 opacity-50" /> {questionsCount}
            </span>
          )}
          {!!(langName || langCode) && (
            <span id="language" className="flex items-center gap-1" title="Topic Language">
              <Icons.Languages className="mr-1 size-4 opacity-50" /> {langContent}
            </span>
          )}
          {!!keywordsList?.length && (
            <span id="keyword" className="flex flex-wrap items-center gap-1" title="Keywords">
              <Icons.Tags className="mr-1 size-4 opacity-50" /> {keywordsContent}
            </span>
          )}
        </div>
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
          {/* TODO: Show a link to manage topic page if it's your own one? */}
        </div>
      </CardContent>
    </Card>
  );
}
