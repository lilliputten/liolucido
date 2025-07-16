import { TTopicId } from '@/features/topics/types';

import { MyTopicsPageModalsWrapper } from './MyTopicsPageModalsWrapper';

interface MyTopicsPageProps {
  showAddModal?: boolean;
  deleteTopicId?: TTopicId;
}

export async function MyTopicsPage({ showAddModal, deleteTopicId }: MyTopicsPageProps = {}) {
  return <MyTopicsPageModalsWrapper showAddModal={showAddModal} deleteTopicId={deleteTopicId} />;
}
