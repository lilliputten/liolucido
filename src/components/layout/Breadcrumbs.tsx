'use client';

import React from 'react';
import Link from 'next/link';

import { TPropsWithClassName, TReactNode } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { isDev } from '@/constants';

function BreadcrumbsDelim() {
  return <span className="opacity-50">&raquo;</span>;
}

export type TBreadcrumbsItemProps = { link?: string; content: TReactNode };
function BreadcrumbsItem({ link, content }: TBreadcrumbsItemProps) {
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
  items: TBreadcrumbsItemProps[];
}

export function Breadcrumbs(props: TBreadcrumbsProps) {
  const { className, items } = props;
  const content: React.JSX.Element[] = [];
  for (let n = 0; n < items.length; n++) {
    const props = items[n];
    content.push(
      <BreadcrumbsItem
        key={
          props.link || (typeof props.content === 'string' ? props.content : `BreadcrumbsItem-${n}`)
        }
        {...props}
      />,
    );
    if (n < items.length - 1) {
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
