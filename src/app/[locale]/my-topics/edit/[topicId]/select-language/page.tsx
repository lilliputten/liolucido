'use client';

import React from 'react';

import { TLanguage } from '@/lib/types';
import { SelectLanguageModal } from '@/components/pages/MyTopicsPage/SelectLanguageModal';

interface SelectLanguagePageProps {
  params: Promise<{
    topicId: string;
  }>;
  searchParams: Promise<{
    langCode?: string;
    langName?: string;
    langCustom?: string;
    hasSelected?: string;
  }>;
}

export default function SelectLanguagePage({ params, searchParams }: SelectLanguagePageProps) {
  // Unwrap the promises using React.use()
  const resolvedParams = React.use(params);
  const resolvedSearchParams = React.use(searchParams);

  const { topicId } = resolvedParams;
  const { langCode, langName, langCustom, hasSelected } = resolvedSearchParams;

  return (
    <SelectLanguageModal
      langCode={langCode}
      langName={langName}
      langCustom={langCustom === 'true'}
      hasSelected={hasSelected === 'true'}
      topicId={parseInt(topicId)}
    />
  );
}
