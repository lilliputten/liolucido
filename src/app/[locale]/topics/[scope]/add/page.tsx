import { ManageTopicsPage } from '@/components/pages/ManageTopicsPage/ManageTopicsPage';
import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps<{ scope: TTopicsManageScopeId }>;

export default function AddTopicPage({ params }: TAwaitedProps) {
  return <ManageTopicsPage showAddModal={true} params={params} />;
}
