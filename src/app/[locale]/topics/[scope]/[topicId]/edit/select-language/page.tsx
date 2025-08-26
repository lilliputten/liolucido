'use client';

import React from 'react';

import { SelectTopicLanguageModal } from '@/components/pages/SelectTopicLanguageModal';

interface SelectLanguagePageProps {
  params: Promise<{
    topicId: string;
  }>;
  searchParams: Promise<{
    langCode?: string;
    langName?: string;
    langCustom?: string;
  }>;
}

export default function SelectTopicLanguageModalParallelRoute({
  params,
  searchParams,
}: SelectLanguagePageProps) {
  const { langCode, langName, langCustom } = React.use(searchParams);
  const { topicId } = React.use(params);
  /* // UNUSED: Check if the topic exists (requires usage of `useAvailableTopicById` instead of direct lookup amongst loaded by `useAvailableTopicsByScope`
   * const { manageScope } = useManageTopicsStore();
   * // const routePath = `/topics/${manageScope}`;
   * const { allTopics } = useAvailableTopicsByScope({ manageScope });
   * const topic = allTopics.find((topic) => topic.id === topicId);
   * if (!topic) {
   *   throw new Error('No such topic exists');
   * }
   */
  return (
    <SelectTopicLanguageModal
      langCode={langCode}
      langName={langName}
      langCustom={langCustom === 'true'}
      topicId={topicId}
    />
  );
}
