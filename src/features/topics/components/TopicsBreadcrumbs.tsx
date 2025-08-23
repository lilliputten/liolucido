'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { TPropsWithClassName } from '@/shared/types/generic';
import { capitalizeString, truncateString } from '@/lib/helpers';
import { filterOutEmpties } from '@/lib/helpers/arrays';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumbs,
  BreadcrumbsItem,
  TBreadcrumbsItemProps,
} from '@/components/layout/Breadcrumbs';
import { isDev } from '@/constants';
import { topicsNamespaces, topicsRoutes, TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TTopic, TTopicId } from '@/features/topics/types';
import { useAvailableTopicsByScope } from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

interface TScopeBreadcrumbsProps {
  scope: TTopicsManageScopeId;
  topic?: TTopic | BreadcrumbsItem;
  lastItem?: TBreadcrumbsItemProps | BreadcrumbsItem;
  inactiveLast?: boolean;
  isLoading?: boolean;
}

export function useTopicsScopeBreadcrumbsItems(props: TScopeBreadcrumbsProps) {
  const { scope, topic, lastItem } = props;
  const topicsListRoutePath = topicsRoutes[scope];
  // TODO: Use i18n translation by `scope`
  const listTitle = capitalizeString(scope) + ' Topics' + (isDev ? '*' : '');
  const items = filterOutEmpties<TBreadcrumbsItemProps>([
    { link: topicsListRoutePath, content: listTitle },
    !topic
      ? null
      : topic instanceof BreadcrumbsItem
        ? topic
        : {
            link: `${topicsListRoutePath}/${topic.id}`,
            content: truncateString(topic.name, 50),
          },
    lastItem,
  ]);
  return items;
}

export function TopicsScopeBreadcrumbs(props: TScopeBreadcrumbsProps & TPropsWithClassName) {
  const { className, isLoading, inactiveLast } = props;
  const items = useTopicsScopeBreadcrumbsItems(props);
  if (isLoading) {
    return (
      <div
        className={cn(
          isDev && '__TopicsScopeBreadcrumbs_Skeleton', // DEBUG
          'flex gap-2',
        )}
      >
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-32 rounded" />
        ))}
      </div>
    );
  }
  if (inactiveLast && items.length) {
    const lastIdx = items.length - 1;
    if (items[lastIdx].link) {
      items[lastIdx] = { ...items[lastIdx], link: undefined };
    }
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

// Below items are used only with `useTopicsContext` and in `QuestionsBreadcrumbs` (TO REMOVE)
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
