'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { TPropsWithClassName } from '@/shared/types/generic';
import { filterOutEmpties } from '@/lib/helpers/arrays';
import { cn } from '@/lib/utils';
import { Breadcrumbs, TBreadcrumbsItemProps } from '@/components/layout/Breadcrumbs';
import { isDev } from '@/constants';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { TTopic, TTopicId } from '@/features/topics/types';

export interface TTopicsBreadcrumbsProps {
  topicId?: TTopicId;
  inactiveTopic?: boolean;
  lastItem?: TBreadcrumbsItemProps;
}

export function useTopicsBreadcrumbsItems(props: TTopicsBreadcrumbsProps) {
  const { topicId, inactiveTopic } = props;
  const topicsContext = useTopicsContext();
  const { topics, routePath, namespace } = topicsContext;
  const t = useTranslations(namespace);
  const topic: TTopic | undefined = React.useMemo(
    () => (topicId ? topics.find(({ id }) => id === topicId) : undefined),
    [topics, topicId],
  );
  const items = filterOutEmpties<TBreadcrumbsItemProps>([
    { link: routePath, content: t('title') },
    !!topic && {
      link: inactiveTopic ? undefined : `${routePath}/${topic.id}`,
      content: topic.name,
    },
  ]);
  return items;
}

export function TopicsBreadcrumbs(props: TTopicsBreadcrumbsProps & TPropsWithClassName) {
  const { className, lastItem, ...rest } = props;
  const items = useTopicsBreadcrumbsItems(rest);
  return (
    <Breadcrumbs
      className={cn(
        isDev && '__TopicsBreadcrumbs', // DEBUG
        className,
      )}
      items={lastItem ? items.concat(lastItem) : items}
    />
  );
}
