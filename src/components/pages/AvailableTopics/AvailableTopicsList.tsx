import React from 'react';
import Link from 'next/link';

import { TPropsWithClassName } from '@/shared/types/generic';
import { getRandomHashString, truncateString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { TTopic } from '@/features/topics/types';

const saveScrollHash = getRandomHashString();

interface TTopicItemProps {
  idx: number;
  topic: TTopic;
}

function TopicItem(props: TTopicItemProps) {
  const { topic } = props;
  const {
    id,
    name,
    langCode,
    langName,
    keywords,
    // description,
    // userId,
    _count,
  } = topic;
  const questionsCount = _count?.questions;
  const topicsContext = useTopicsContext();
  const { routePath } = topicsContext;

  return (
    <Card
      className={cn(
        isDev && '__AvailableTopicsList_TopicItem_Card', // DEBUG
        'relative flex flex-1 flex-col',
      )}
    >
      <CardHeader
        className={cn(
          isDev && '__AvailableTopicsList_TopicItem_CardContent', // DEBUG
          'relative flex flex-1 flex-col',
        )}
      >
        <div id="name">
          <Link
            className="truncate text-lg font-medium hover:underline"
            href={`${routePath}/${id}`}
          >
            {truncateString(name, 40)}
          </Link>
        </div>
      </CardHeader>
      <CardContent
        className={cn(
          isDev && '__AvailableTopicsList_TopicItem_CardContent', // DEBUG
          'relative flex flex-1 flex-col',
        )}
      >
        <div id="name">
          <Link
            className="truncate text-lg font-medium hover:underline"
            href={`${routePath}/${id}`}
          >
            {truncateString(name, 40)}
          </Link>
        </div>
        <div id="questions">
          Questions:
          {questionsCount ? (
            <span className="font-bold">{questionsCount}</span>
          ) : (
            <span className="opacity-30">—</span>
          )}
        </div>
        <div id="language">
          Language:
          {[langName, langCode && `(${langCode})`].filter(Boolean).join(' ')}
        </div>
        <div id="keywords">
          Keywords:
          {keywords}
        </div>
      </CardContent>
    </Card>
  );
}

interface TAvailableTopicsListProps extends TPropsWithClassName {
  topics: TTopic[];
}

export function AvailableTopicsList(props: TAvailableTopicsListProps) {
  const { className, topics } = props;
  return (
    <ScrollArea
      saveScrollKey="AvailableTopicsList"
      saveScrollHash={saveScrollHash}
      // viewportClassName="px-6"
      className={cn(
        isDev && '__AvailableTopicsList', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      {topics.map((topic, idx) => (
        <TopicItem key={topic.id} idx={idx} topic={topic} />
      ))}
    </ScrollArea>
  );
}
