import React from 'react';
import Link from 'next/link';
import { useFormatter } from 'next-intl';

import { compareDates, getFormattedRelativeDate } from '@/lib/helpers/dates';
import { cn } from '@/lib/utils';
import { useSessionUser } from '@/hooks/useSessionUser';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { TAvailableTopic } from '@/features/topics/types';

interface TTopicHeaderOptions {
  showDates?: boolean;
  showDescription?: boolean;
}
interface TTopicHeaderProps {
  topic: TAvailableTopic;
  className?: string;
}

export function TopicHeader(props: TTopicHeaderProps & TTopicHeaderOptions) {
  const {
    topic,
    className,
    // Options...
    showDates,
    showDescription,
  } = props;
  const format = useFormatter();
  const {
    id,
    userId,
    // user,
    name,
    description,
    isPublic,
    // langCode,
    // langName,
    // keywords,
    createdAt,
    updatedAt,
    // _count,
  } = topic;
  const sessionUser = useSessionUser();
  const isOwner = userId && userId === sessionUser?.id;
  const topicsContext = useTopicsContext();
  const { routePath } = topicsContext;
  const PublicIcon = isPublic ? Icons.Eye : Icons.EyeOff;
  const topicRoutePath = `${routePath}/${id}`;
  return (
    <div
      className={cn(
        isDev && '__TopicHeader', // DEBUG
        'flex flex-row gap-2',
        className,
      )}
    >
      <div id="left-name" className="flex flex-1 flex-col gap-2">
        <div id="name">
          <Link className="flex-1 text-xl font-medium" href={topicRoutePath}>
            {name}
          </Link>
        </div>
        {/* TODO: Format descrption text */}
        {showDescription && <div id="description">{description}</div>}
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
        {showDates && (
          <span id="createdAt" className="flex items-center gap-1" title="Creation date">
            <Icons.CalendarDays className="mr-1 size-4 opacity-50" />{' '}
            {getFormattedRelativeDate(format, createdAt)}
          </span>
        )}
        {showDates && updatedAt && !!compareDates(updatedAt, createdAt) && (
          <span id="createdAt" className="flex items-center gap-1" title="Updated date">
            <Icons.Pencil className="mr-1 size-4 opacity-50" />{' '}
            {getFormattedRelativeDate(format, updatedAt)}
          </span>
        )}
      </div>
    </div>
  );
}
