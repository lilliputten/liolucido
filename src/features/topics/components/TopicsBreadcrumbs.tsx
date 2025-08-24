'use client';

import React from 'react';

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
import { topicsRoutes, TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TTopic } from '@/features/topics/types';

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
