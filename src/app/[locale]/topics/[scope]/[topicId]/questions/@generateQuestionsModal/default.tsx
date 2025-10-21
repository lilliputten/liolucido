'use client';

import { usePathname } from 'next/navigation';

import { GenerateQuestionsModal } from '@/components/pages/ManageTopicQuestions/GenerateQuestionsModal';

export default function GenerateQuestionsModalDefault() {
  const pathname = usePathname();

  // Only render the modal if we're on the questions/generate route
  const isGenerateQuestionsRoute = pathname?.endsWith('/questions/generate');

  if (isGenerateQuestionsRoute) {
    return <GenerateQuestionsModal />;
  }

  return null;
}
