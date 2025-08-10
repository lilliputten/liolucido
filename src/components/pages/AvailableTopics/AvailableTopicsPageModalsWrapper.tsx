'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { AvailableTopicsPageWrapper } from '@/components/pages/AvailableTopics/AvailableTopicsPageWrapper';
import { PageHeader } from '@/components/pages/shared';
import { isDev } from '@/constants';

import { AvailableTopicsListWrapper } from './AvailableTopicsListWrapper';

export function AvailableTopicsPageModalsWrapper(/* props: TTopicsListProps */) {
  return (
    <AvailableTopicsPageWrapper>
      <PageHeader heading="Available Topics" />
      <div
        className={cn(
          isDev && '__AvailableTopicsListWrapper', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden',
        )}
      >
        <AvailableTopicsListWrapper
        // TODO: Pass modal and slot controlling props
        />
      </div>
    </AvailableTopicsPageWrapper>
  );
}
