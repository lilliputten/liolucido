'use client';

import React from 'react';

import { useAvailableTopicsByScope } from '@/hooks/useAvailableTopics';
import { SelectTopicLanguageModal } from '@/components/pages/SelectTopicLanguageModal';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

interface SelectTopicLanguageModalPageProps {
  params: Promise<{
    topicId: string;
  }>;
  searchParams: Promise<{
    langCode?: string;
    langName?: string;
    langCustom?: string;
  }>;
}

export default function SelectTopicLanguageModalInterceptingRoute({
  params,
  searchParams,
}: SelectTopicLanguageModalPageProps) {
  const { manageScope } = useManageTopicsStore();
  // const routePath = `/topics/${manageScope}`;
  const { langCode, langName, langCustom } = React.use(searchParams);
  const { topicId } = React.use(params);
  const { allTopics } = useAvailableTopicsByScope({ manageScope });
  const topic = allTopics.find((topic) => topic.id === topicId);
  if (!topic) {
    throw new Error('No such topic exists');
  }
  return (
    <SelectTopicLanguageModal
      langCode={langCode}
      langName={langName}
      langCustom={langCustom === 'true'}
      topicId={topicId}
    />
  );
}
