import { TTopicId } from '@/features/topics/types';

import { MyTopicsPageModalsWrapper } from './MyTopicsPageModalsWrapper';

interface MyTopicsPageProps {
  showAddModal?: boolean;
  deleteTopicId?: TTopicId;
  editTopicId?: TTopicId;
}

export async function MyTopicsPage(props: MyTopicsPageProps = {}) {
  const { showAddModal, deleteTopicId, editTopicId } = props;
  return (
    <MyTopicsPageModalsWrapper
      showAddModal={showAddModal}
      deleteTopicId={deleteTopicId}
      editTopicId={editTopicId}
    />
  );
}
