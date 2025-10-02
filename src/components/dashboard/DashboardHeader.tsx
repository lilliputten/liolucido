'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { isDev } from '@/constants';

import { DashboardMenu } from './DashboardMenu';

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  // children?: React.ReactNode;
  className?: string;
}

export function DashboardHeader(props: DashboardHeaderProps) {
  const {
    className,
    heading,
    text,
    // children,
  } = props;
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
        {text && <p className="text-base text-muted-foreground">{text}</p>}
      </div>
      <DashboardMenu />
    </div>
  );
}
