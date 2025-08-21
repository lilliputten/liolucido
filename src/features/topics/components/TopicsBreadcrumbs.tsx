'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { TPropsWithClassName } from '@/shared/types/generic';
import { capitalizeString, truncateString } from '@/lib/helpers';
import { filterOutEmpties } from '@/lib/helpers/arrays';
import { cn } from '@/lib/utils';
import { useAvailableTopicsByScope } from '@/hooks/useAvailableTopics';
import { Breadcrumbs, TBreadcrumbsItemProps } from '@/components/layout/Breadcrumbs';
import { isDev } from '@/constants';
import { topicsNamespaces, topicsRoutes, TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TTopic, TTopicId } from '@/features/topics/types';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

export interface TTopicsBreadcrumbsProps {
  topicId?: TTopicId;
  topic?: TTopic;
  inactiveTopic?: boolean;
  lastItem?: TBreadcrumbsItemProps;
}

export function useTopicsBreadcrumbsItems(props: TTopicsBreadcrumbsProps) {
  const { manageScope } = useManageTopicsStore();
  const namespace = topicsNamespaces[manageScope];
  const routePath = `/topics/${manageScope}`;
  const { topicId, topic, inactiveTopic } = props;
  const availableTopics = useAvailableTopicsByScope({ manageScope });
  const { allTopics } = availableTopics;
  const t = useTranslations(namespace);
  const usedTopic: TTopic | undefined = React.useMemo(
    () => topic || (topicId ? allTopics.find(({ id }) => id === topicId) : undefined),
    [topic, allTopics, topicId],
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

/* // UNUSED: In favour of `TopicsScopeBreadcrumbs`, not used in the codebase
 * export function TopicsBreadcrumbs(props: TTopicsBreadcrumbsProps & TPropsWithClassName) {
 *   const { className, lastItem, ...rest } = props;
 *   const items = useTopicsBreadcrumbsItems(rest);
 *   return (
 *     <Breadcrumbs
 *       className={cn(
 *         isDev && '__TopicsBreadcrumbs', // DEBUG
 *         className,
 *       )}
 *       items={lastItem ? items.concat(lastItem) : items}
 *     />
 *   );
 * }
 */
