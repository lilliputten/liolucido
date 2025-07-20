import { TQuestionId } from '@/features/questions/types';

import { ManageTopicQuestionsPageModalsWrapper } from './ManageTopicQuestionsPageModalsWrapper';

interface ManageTopicQuestionsPageProps {
  showAddModal?: boolean;
  deleteQuestionId?: TQuestionId;
  editQuestionId?: TQuestionId;
}

export async function ManageTopicQuestionsPage(props: ManageTopicQuestionsPageProps = {}) {
  const { showAddModal, deleteQuestionId, editQuestionId } = props;
  return (
    <ManageTopicQuestionsPageModalsWrapper
      showAddModal={showAddModal}
      deleteQuestionId={deleteQuestionId}
      editQuestionId={editQuestionId}
    />
  );
}
