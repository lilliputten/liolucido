import { TTopicsManageScopeId } from '@/contexts/TopicsContext';
import { TAwaitedLocaleProps } from '@/i18n/types';

import ManageTopicsPage from '../page';

type TAwaitedProps = TAwaitedLocaleProps<{ scope: TTopicsManageScopeId }>;

export default function AddTopicPage({ params }: TAwaitedProps) {
  return <ManageTopicsPage showAddModal={true} params={params} />;
}
