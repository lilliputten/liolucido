import { constructMetadata } from '@/lib/utils';
import { DeleteQuestionModal } from '@/components/pages/ManageTopicQuestions';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{ scope: TTopicsManageScopeId }>;

interface DeleteQuestionModalPageProps {
  searchParams: Promise<{ questionId?: string; from?: string }>;
}

export async function generateMetadata({ params }: TAwaitedProps) {
  const { locale } = await params;
  // const t = await getTranslations({ locale, namespace });
  // TODO: Add topic/question name?
  const title = 'Delete Question'; // t('title');
  // const description = t('description');
  return constructMetadata({
    locale,
    title,
    // description,
  });
}

export default async function DeleteQuestionModalPage({
  searchParams,
}: DeleteQuestionModalPageProps) {
  const { questionId, from } = await searchParams;
  if (questionId) {
    return <DeleteQuestionModal questionId={questionId} from={from} />;
  }
}
