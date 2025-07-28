import { PageError } from '@/components/shared/PageError';
import { TQuestionId } from '@/features/questions/types';

import { ManageTopicQuestionsPageModalsWrapper } from './ManageTopicQuestionsPageModalsWrapper';

interface EditManageTopicPageProps {
  params: {
    topicId: string;
  };
}

interface ManageTopicQuestionsPageProps {
  showAddModal?: boolean;
  deleteQuestionId?: TQuestionId;
  editQuestionId?: TQuestionId;
}

export async function ManageTopicQuestionsPage(
  props: ManageTopicQuestionsPageProps & EditManageTopicPageProps,
) {
  const { showAddModal, deleteQuestionId, editQuestionId, params } = props;

  const { topicId } = await params;

  if (!topicId) {
    return <PageError error={'No topic specified.'} />;
  }

  return (
    <ManageTopicQuestionsPageModalsWrapper
      showAddModal={showAddModal}
      deleteQuestionId={deleteQuestionId}
      editQuestionId={editQuestionId}
      topicId={topicId}
    />
  );
}
