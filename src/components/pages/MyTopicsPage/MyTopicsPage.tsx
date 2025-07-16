import { TTopicId } from '@/features/topics/types';

import { MyTopicsList } from './MyTopicsList';

interface MyTopicsPageProps {
  showAddModal?: boolean;
  deleteTopicId?: TTopicId;
}

export async function MyTopicsPage({ showAddModal, deleteTopicId }: MyTopicsPageProps = {}) {
  return <MyTopicsList showAddModal={showAddModal} deleteTopicId={deleteTopicId} />;
}
