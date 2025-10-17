'use client';

import React from 'react';
import Link from 'next/link';

import { TPropsWithClassName, TReactNode } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { isDev } from '@/constants';

function BreadcrumbsDelim() {
  return <span className="opacity-50">&raquo;</span>;
}

export interface TBreadcrumbsItemProps {
  link?: string;
  content?: TReactNode;
  loading?: boolean;
}

export class BreadcrumbsItem implements TBreadcrumbsItemProps {
  link: TBreadcrumbsItemProps['link'];
  content: TBreadcrumbsItemProps['content'];
  loading: TBreadcrumbsItemProps['loading'];

  constructor(props: TBreadcrumbsItemProps) {
    this.link = props.link;
    this.content = props.content;
    this.loading = props.loading;
  }
}

function RenderBreadcrumbsItem({
  link,
  content,
  loading,
}: TBreadcrumbsItemProps | BreadcrumbsItem) {
  if (loading) {
    return <Skeleton className="h-1 w-5 truncate rounded" />;
  }
  if (!content) {
    return null;
  }
  if (!link) {
    return <span className="truncate opacity-50">{content}</span>;
  }
  return (
    <Link href={link} className="truncate hover:underline">
      {content}
    </Link>
  );
}

interface TBreadcrumbsProps extends TPropsWithClassName {
  items: (TBreadcrumbsItemProps | undefined)[];
  inactiveLast?: boolean;
}

export function Breadcrumbs(props: TBreadcrumbsProps) {
  const { className, items, inactiveLast } = props;
  const content: React.JSX.Element[] = [];
  const filteredItems = items.filter(Boolean) as TBreadcrumbsItemProps[];
  for (let n = 0; n < filteredItems.length; n++) {
    const isLast = n === filteredItems.length - 1;
    const props = filteredItems[n];
    content.push(
      <RenderBreadcrumbsItem
        key={
          props.link || (typeof props.content === 'string' ? props.content : `BreadcrumbsItem-${n}`)
        }
        {...props}
        link={isLast && inactiveLast ? undefined : props.link}
      />,
    );
    if (n < filteredItems.length - 1) {
      content.push(<BreadcrumbsDelim key={`BreadcrumbsDelim-${n}`} />);
    }
  }
  return (
    <div
      className={cn(
        isDev && '__Breadcrumbs', // DEBUG
        'flex gap-1 gap-x-2 overflow-hidden text-sm',
        // 'truncate-start',
        className,
      )}
    >
      {content}
    </div>
  );
}
