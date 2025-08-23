'use client';

import React from 'react';
import Link from 'next/link';

import { TPropsWithClassName, TReactNode } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { isDev } from '@/constants';

import { Skeleton } from '../ui/skeleton';

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
    return <Skeleton className="h-1 w-5 rounded" />;
  }
  if (!content) {
    return null;
  }
  if (!link) {
    return <span className="opacity-50">{content}</span>;
  }
  return (
    <Link href={link} className="hover:underline">
      {content}
    </Link>
  );
}

interface TBreadcrumbsProps extends TPropsWithClassName {
  items: (TBreadcrumbsItemProps | undefined)[];
}

export function Breadcrumbs(props: TBreadcrumbsProps) {
  const { className, items } = props;
  const content: React.JSX.Element[] = [];
  const filteredItems = items.filter(Boolean) as TBreadcrumbsItemProps[];
  for (let n = 0; n < filteredItems.length; n++) {
    const props = filteredItems[n];
    content.push(
      <RenderBreadcrumbsItem
        key={
          props.link || (typeof props.content === 'string' ? props.content : `BreadcrumbsItem-${n}`)
        }
        {...props}
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
        'flex flex-wrap gap-1 gap-x-3 overflow-hidden',
        'text-sm',
        className,
      )}
    >
      {content}
    </div>
  );
}
