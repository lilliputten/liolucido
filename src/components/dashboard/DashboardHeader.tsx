'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { Breadcrumbs, TBreadcrumbsItemProps } from '@/components/layout/Breadcrumbs';
import { isDev } from '@/constants';

import { DashboardActions, TActionMenuItem } from './DashboardActions';

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  className?: string;
  actions?: TActionMenuItem[];
  breadcrumbs?: TBreadcrumbsItemProps[];
}

export function DashboardHeader(props: DashboardHeaderProps) {
  const { className, heading, text, actions, breadcrumbs } = props;
  return (
    <div
      className={cn(
        isDev && '__DashboardHeader', // DEBUG
        'flex items-center justify-between gap-2',
        className,
      )}
    >
      <div
        className={cn(
          isDev && '__DashboardHeader_Content', // DEBUG
          'flex flex-1 flex-col gap-1 truncate',
        )}
      >
        {breadcrumbs && (
          <Breadcrumbs
            className={cn(
              isDev && '__DashboardHeader_Breadcrumbs', // DEBUG
              'truncate',
            )}
            items={breadcrumbs}
          />
        )}
        <h1 className="truncate font-heading text-2xl font-semibold text-theme" title={heading}>
          {heading}
        </h1>
        {text && (
          <p className="truncate text-base opacity-50" title={text}>
            {text}
          </p>
        )}
      </div>
      {actions && <DashboardActions actions={actions} />}
    </div>
  );
}
