import { TTopicId } from '@/features/topics/types';

import { ManageTopicsPageModalsWrapper } from './ManageTopicsPageModalsWrapper';

interface ManageTopicsPageProps {
  showAddModal?: boolean;
  deleteTopicId?: TTopicId;
  editTopicId?: TTopicId;
}

export async function ManageTopicsPage(props: ManageTopicsPageProps = {}) {
  const { showAddModal, deleteTopicId, editTopicId } = props;
  return (
    <ManageTopicsPageModalsWrapper
      showAddModal={showAddModal}
      deleteTopicId={deleteTopicId}
      editTopicId={editTopicId}
    />
  );
}
