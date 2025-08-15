'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import { DeleteAnswerModal } from '@/components/pages/ManageTopicQuestionAnswers';

export default function DeleteAnswerModalDefault() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isDeleteRoute = pathname?.endsWith('/delete');
  const answerId = searchParams.get('answerId');

  if (isDeleteRoute && answerId) {
    const from = searchParams.get('from') || undefined;
    return <DeleteAnswerModal answerId={answerId} from={from} />;
  }

  return null;
}
