'use client';

import React from 'react';

import { SelectTopicLanguageModal } from '@/components/pages/SelectTopicLanguageModal';

interface SelectTopicLanguageModalPageProps {
  searchParams: Promise<{
    langCode?: string;
    langName?: string;
    langCustom?: string;
  }>;
}

export default function SelectTopicLanguageModalInterceptingRoute({
  searchParams,
}: SelectTopicLanguageModalPageProps) {
  const { langCode, langName, langCustom } = React.use(searchParams);
  return (
    <SelectTopicLanguageModal
      langCode={langCode}
      langName={langName}
      langCustom={langCustom === 'true'}
    />
  );
}
