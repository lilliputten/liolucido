'use client';

import { usePathname } from 'next/navigation';

import { GenerateAnswersModal } from '@/components/pages/ManageTopicQuestionAnswers';

export default function GenerateAnswersModalDefault() {
  const pathname = usePathname();

  // Only render the modal if we're on the answers/generate route
  const isGenerateAnswersRoute = pathname?.endsWith('/answers/generate');

  if (isGenerateAnswersRoute) {
    return <GenerateAnswersModal />;
  }

  return null;
}
