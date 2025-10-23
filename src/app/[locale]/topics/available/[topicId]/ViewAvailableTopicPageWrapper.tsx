'use client';

import React from 'react';

import { TTopicId } from '@/features/topics/types';
import { useAvailableTopicById } from '@/hooks';

import { ContentSkeleton } from './ContentSkeleton';
import { ViewAvailableTopic } from './ViewAvailableTopic';

interface TViewAvailableTopicPageWrapperProps {
  topicId: TTopicId;
}

export function ViewAvailableTopicPageWrapper(props: TViewAvailableTopicPageWrapperProps) {
  const { topicId } = props;

  if (!topicId) {
    throw new Error('No topic ID specified');
  }

  const availableTopicQuery = useAvailableTopicById({ id: topicId });

  const { topic, isFetched: isTopicFetched, isCached: isTopicCached } = availableTopicQuery;

  const isTopicReady = isTopicCached || isTopicFetched;

  // No data loaded yet - show skeleton
  if (!isTopicReady) {
    return <ContentSkeleton />;
  }

  if (!topic) {
    throw new Error('No topic loaded for ' + topicId);
  }

  return <ViewAvailableTopic topic={topic} />;
}
