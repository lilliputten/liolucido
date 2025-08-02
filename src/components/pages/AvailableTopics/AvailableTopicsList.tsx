import React from 'react';

import { TPropsWithClassName } from '@/shared/types/generic';
import { getRandomHashString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { TTopic } from '@/features/topics/types';

import { AvailableTopicsListItem } from './AvailableTopicsListItem';

const saveScrollHash = getRandomHashString();

interface TAvailableTopicsListProps extends TPropsWithClassName {
  topics: TTopic[];
}

export function AvailableTopicsList(props: TAvailableTopicsListProps) {
  const { className, topics } = props;
  return (
    <ScrollArea
      saveScrollKey="AvailableTopicsList"
      saveScrollHash={saveScrollHash}
      viewportClassName={cn(
        isDev && '__AvailableTopicsList_Viewport', // DEBUG
        'relative flex flex-1 flex-col',
        '[&>div]:gap-4 [&>div]:flex-col',
      )}
      className={cn(
        isDev && '__AvailableTopicsList', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      {topics.map((topic, idx) => (
        <AvailableTopicsListItem key={topic.id} idx={idx} topic={topic} />
      ))}
    </ScrollArea>
  );
}
