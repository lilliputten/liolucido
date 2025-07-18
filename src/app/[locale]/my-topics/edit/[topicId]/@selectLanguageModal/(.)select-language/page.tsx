'use client';

import React from 'react';

import { SelectLanguageModal } from '@/components/pages/MyTopicsPage/SelectLanguageModal';

interface SelectLanguageModalPageProps {
  params: Promise<{
    topicId: string;
  }>;
  searchParams: Promise<{
    langCode?: string;
    langName?: string;
    langCustom?: string;
  }>;
}

export default function SelectLanguageModalPage({
  params,
  searchParams,
}: SelectLanguageModalPageProps) {
  // Unwrap the promises using React.use()
  const resolvedParams = React.use(params);
  const resolvedSearchParams = React.use(searchParams);

  const { topicId } = resolvedParams;
  const { langCode, langName, langCustom } = resolvedSearchParams;

  return (
    <SelectLanguageModal
      langCode={langCode}
      langName={langName}
      langCustom={langCustom === 'true'}
      topicId={parseInt(topicId)}
    />
  );
}
