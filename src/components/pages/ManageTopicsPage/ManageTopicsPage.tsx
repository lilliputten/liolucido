import { TTopicId } from '@/features/topics/types';

import { ManageTopicsPageModalsWrapper } from './ManageTopicsPageModalsWrapper';

interface ManageTopicsPageProps {
  showAddModal?: boolean;
  deleteTopicId?: TTopicId;
  editTopicId?: TTopicId;
  from?: string;
}

export async function ManageTopicsPage(props: ManageTopicsPageProps) {
  const { showAddModal, deleteTopicId, editTopicId, from } = props;
  return (
    <ManageTopicsPageModalsWrapper
      showAddModal={showAddModal}
      deleteTopicId={deleteTopicId}
      editTopicId={editTopicId}
      from={from}
    />
  );
}
