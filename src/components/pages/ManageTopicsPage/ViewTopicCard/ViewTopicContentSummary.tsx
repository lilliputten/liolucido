'use client';

import React from 'react';
import Link from 'next/link';
import { useFormatter } from 'next-intl';

import { compareDates, getFormattedRelativeDate } from '@/lib/helpers/dates';
import { cn } from '@/lib/utils';
import { useSessionUser } from '@/hooks/useSessionUser';
import { Badge } from '@/components/ui/badge';
import { MarkdownText } from '@/components/ui/MarkdownText';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext';
import { TAvailableTopic } from '@/features/topics/types';

export function ViewTopicContentSummary({ topic }: { topic: TAvailableTopic }) {
  const format = useFormatter();
  const user = useSessionUser();
  const topicsContext = useTopicsContext();

  const isOwner = !!topic.userId && topic.userId === user?.id;

  return (
    <div
      className={cn(
        isDev && '__ViewTopicContentSummary', // DEBUG
        'mx-6 flex w-full flex-col gap-4',
      )}
    >
      {/* Topic Description */}
      {topic.description && (
        <div data-testid="__Section_TopicDescription" className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Description</h3>
          <div className="rounded-lg bg-slate-500/10 p-4">
            <MarkdownText>{topic.description}</MarkdownText>
          </div>
        </div>
      )}

      {/* Topic Properties */}
      <div data-testid="__Section_Properties" className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Properties</h3>
        <div className="flex flex-wrap gap-2">
          {!!topic._count?.questions && (
            <Link href={`${topicsContext.routePath}/${topic.id}/questions`}>
              <Badge
                variant="default"
                className="cursor-pointer bg-theme-500 hover:bg-theme-500/80"
              >
                <Icons.questions className="mr-1 size-3 opacity-50" />
                Questions: {topic._count.questions}
              </Badge>
            </Link>
          )}
          <Badge variant={topic.isPublic ? 'success' : 'secondary'}>
            {topic.isPublic ? (
              <Icons.Eye className="mr-1 size-3 opacity-50" />
            ) : (
              <Icons.EyeOff className="mr-1 size-3 opacity-50" />
            )}
            {topic.isPublic ? 'Public' : 'Private'}
          </Badge>
          {topic.langName && (
            <Badge variant="outline">
              <Icons.languages className="mr-1 size-3 opacity-50" />
              {topic.langName} {topic.langCode && `(${topic.langCode})`}
            </Badge>
          )}
          {topic.answersCountRandom && topic.answersCountMin && topic.answersCountMax && (
            <Badge variant="secondary">
              <Icons.Hash className="mr-1 size-3 opacity-50" />
              Random Answers: ${topic.answersCountMin}-${topic.answersCountMax}
            </Badge>
          )}
        </div>
      </div>

      {/* Keywords */}
      {topic.keywords && (
        <div data-testid="__Section_Keywords" className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {topic.keywords.split(',').map((keyword, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {/* <Icons.Tags className="mr-1 size-3 opacity-50" /> */}
                {keyword.trim()}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Timestamps */}
      <div data-testid="__Section_Timeline" className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Timeline</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Icons.CalendarDays className="size-4 text-muted-foreground opacity-50" />
            <span className="text-muted-foreground">Created:</span>
            <span>{getFormattedRelativeDate(format, topic.createdAt)}</span>
          </div>
          {!!compareDates(topic.updatedAt, topic.createdAt) && (
            <div className="flex items-center gap-2">
              <Icons.edit className="size-4 text-muted-foreground opacity-50" />
              <span className="text-muted-foreground">Modified:</span>
              <span>{getFormattedRelativeDate(format, topic.updatedAt)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Author Info */}
      <div data-testid="__Section_Author" className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Author</h3>
        <div className="flex items-center gap-2 text-sm">
          {isOwner ? (
            <>
              <Icons.ShieldCheck className="size-4 text-muted-foreground opacity-50" />
              <span>You're the author</span>
            </>
          ) : (
            topic.user && (
              <>
                <Icons.user className="size-4 text-muted-foreground opacity-50" />
                <span className="text-muted-foreground">Topic created by:</span>
                <span>{topic.user.name || topic.user.email || 'Unknown'}</span>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
