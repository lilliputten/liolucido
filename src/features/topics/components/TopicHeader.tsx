import React from 'react';
import Link from 'next/link';
import { useFormatter } from 'next-intl';

import { compareDates, getFormattedRelativeDate } from '@/lib/helpers/dates';
import { cn } from '@/lib/utils';
import { MarkdownText } from '@/components/ui/MarkdownText';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { topicsRoutes, TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAvailableTopic } from '@/features/topics/types';
import { useSessionUser } from '@/hooks';
import { comparePathsWithoutLocalePrefix } from '@/i18n/helpers';
import { usePathname } from '@/i18n/routing'; // TODO: Use 'next/navigation'

interface TTopicHeaderOptions {
  showDates?: boolean;
  showDescription?: boolean;
  withLink?: boolean;
}
interface TTopicHeaderProps {
  topic: TAvailableTopic;
  scope: TTopicsManageScopeId;
  className?: string;
}

export function TopicHeader(props: TTopicHeaderProps & TTopicHeaderOptions) {
  const {
    topic,
    scope,
    className,
    // Options...
    showDates,
    showDescription,
    withLink,
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
  const topicsListRoutePath = topicsRoutes[scope];
  const PublicIcon = isPublic ? Icons.Eye : Icons.EyeOff;
  const topicRoutePath = `${topicsListRoutePath}/${id}`;
  const pathname = usePathname();
  let nameContent = <>{name}</>;
  if (withLink) {
    const isCurrentTopicRoutePath = comparePathsWithoutLocalePrefix(topicRoutePath, pathname);
    if (!isCurrentTopicRoutePath) {
      // Do not use a link if it's already on the its page
      nameContent = (
        <Link className="flex-1 text-xl font-medium hover:underline" href={topicRoutePath}>
          {nameContent}
        </Link>
      );
    }
  }
  return (
    <div
      className={cn(
        isDev && '__TopicHeader', // DEBUG
        'flex flex-row gap-4',
        className,
      )}
    >
      <div id="left-name" className="flex flex-1 flex-col gap-4">
        <div id="name" className="text-2xl">
          {nameContent}
        </div>
        {/* TODO: Format descrption text */}
        {showDescription && !!description && (
          <div id="description">
            <MarkdownText>{description}</MarkdownText>
          </div>
        )}
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
