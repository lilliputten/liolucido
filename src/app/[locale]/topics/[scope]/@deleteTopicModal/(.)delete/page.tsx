import { DeleteTopicModal } from '@/components/pages/ManageTopicsPage';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{
  scope: TTopicsManageScopeId;
}>;

interface DeleteTopicModalPageProps extends TAwaitedProps {
  searchParams: Promise<{ topicId?: string; from?: string }>;
}

export default async function DeleteTopicModalPage({ searchParams }: DeleteTopicModalPageProps) {
  const { topicId, from } = await searchParams;
  if (topicId) {
    return <DeleteTopicModal topicId={topicId} from={from} />;
  }
}
