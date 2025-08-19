'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { TPropsWithClassName } from '@/shared/types/generic';
import { capitalizeString, truncateString } from '@/lib/helpers';
import { filterOutEmpties } from '@/lib/helpers/arrays';
import { cn } from '@/lib/utils';
import { Breadcrumbs, TBreadcrumbsItemProps } from '@/components/layout/Breadcrumbs';
import { isDev } from '@/constants';
import { topicsRoutes, TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { useTopicsContext } from '@/contexts/TopicsContext/TopicsContext';
import { TTopic, TTopicId } from '@/features/topics/types';

export interface TTopicsBreadcrumbsProps {
  topicId?: TTopicId;
  topic?: TTopic;
  inactiveTopic?: boolean;
  lastItem?: TBreadcrumbsItemProps;
}

export function useTopicsBreadcrumbsItems(props: TTopicsBreadcrumbsProps) {
  const { topicId, topic, inactiveTopic } = props;
  const topicsContext = useTopicsContext();
  const { topics, routePath, namespace } = topicsContext;
  const t = useTranslations(namespace);
  const usedTopic: TTopic | undefined = React.useMemo(
    () => topic || (topicId ? topics.find(({ id }) => id === topicId) : undefined),
    [topic, topics, topicId],
  );
  const items = filterOutEmpties<TBreadcrumbsItemProps>([
    { link: routePath, content: t('title') },
    !!usedTopic && {
      link: inactiveTopic ? undefined : `${routePath}/${usedTopic.id}`,
      content: usedTopic.name,
    },
  ]);
  return items;
}

interface TScopeBreadcrumbsProps {
  scope: TTopicsManageScopeId;
  topic?: TTopic;
  lastItem?: TBreadcrumbsItemProps;
  inactiveLast?: boolean;
}
export function TopicsScopeBreadcrumbs(props: TScopeBreadcrumbsProps & TPropsWithClassName) {
  const { className, scope, topic, lastItem, inactiveLast } = props;
  const routePath = topicsRoutes[scope];
  // TODO: Use i18n translation by `scope`
  const title = capitalizeString(scope) + ' Topics*';
  const items = filterOutEmpties<TBreadcrumbsItemProps>([
    { link: routePath, content: title },
    topic && { link: `${routePath}/${topic.id}`, content: truncateString(topic.name, 50) },
    lastItem,
  ]);
  if (inactiveLast && items.length) {
    items[items.length - 1] = { ...items[items.length - 1], link: undefined };
  }
  return (
    <Breadcrumbs
      className={cn(
        isDev && '__TopicsScopeBreadcrumbs', // DEBUG
        className,
      )}
      items={items}
    />
  );
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
