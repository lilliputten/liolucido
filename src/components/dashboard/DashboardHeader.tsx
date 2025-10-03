'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { isDev } from '@/constants';

import { DashboardActions, TActionMenuItem } from './DashboardActions';

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  className?: string;
  actions?: TActionMenuItem[];
}

export function DashboardHeader(props: DashboardHeaderProps) {
  const { className, heading, text, actions } = props;
  return (
    <div
      className={cn(
        isDev && '__DashboardHeader', // DEBUG
        'flex items-center justify-between',
        className,
      )}
    >
      <div
        className={cn(
          isDev && '__DashboardHeader_Header', // DEBUG
          'flex flex-col gap-1',
        )}
      >
        <h1 className="font-heading text-2xl font-semibold text-theme">{heading}</h1>
        {text && <p className="text-base opacity-50">{text}</p>}
      </div>
      <DashboardActions actions={actions} />
    </div>
  );
}
