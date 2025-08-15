'use client';

import { usePathname } from 'next/navigation';

import { AddAnswerModal } from '@/components/pages/ManageTopicQuestionAnswers';

export default function AddAnswerModalDefault() {
  const pathname = usePathname();

  // Only render the modal if we're on the answers/add route
  const isAddAnswerRoute = pathname?.endsWith('/answers/add');

  if (isAddAnswerRoute) {
    return <AddAnswerModal />;
  }

  return null;
}
