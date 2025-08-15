'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import { DeleteQuestionModal } from '@/components/pages/ManageTopicQuestions';

export default function DeleteQuestionModalDefault() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isDeleteRoute = pathname?.endsWith('/delete');
  const questionId = searchParams.get('questionId');

  if (isDeleteRoute && questionId) {
    const from = searchParams.get('from') || undefined;
    return <DeleteQuestionModal questionId={questionId} from={from} />;
  }

  return null;
}
