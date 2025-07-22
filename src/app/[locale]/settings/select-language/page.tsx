'use client';

import React from 'react';

import { SelectTopicLanguageModal } from '@/components/pages/SelectTopicLanguageModal';

interface SelectLanguagePageProps {
  searchParams: Promise<{
    langCode?: string;
    langName?: string;
    langCustom?: string;
  }>;
}

export default function SelectTopicLanguageModalParallelRoute({
  searchParams,
}: SelectLanguagePageProps) {
  const { langCode, langName, langCustom } = React.use(searchParams);
  return (
    <SelectTopicLanguageModal
      langCode={langCode}
      langName={langName}
      langCustom={langCustom === 'true'}
    />
  );
}
