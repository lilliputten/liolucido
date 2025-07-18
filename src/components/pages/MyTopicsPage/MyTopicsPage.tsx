import { TSelectLanguageData } from '@/lib/types/language';
import { TTopicId } from '@/features/topics/types';

import { MyTopicsPageModalsWrapper } from './MyTopicsPageModalsWrapper';

interface MyTopicsPageProps {
  showAddModal?: boolean;
  deleteTopicId?: TTopicId;
  editTopicId?: TTopicId;
  selectLanguageData?: TSelectLanguageData;
}

export async function MyTopicsPage(props: MyTopicsPageProps = {}) {
  const { showAddModal, deleteTopicId, editTopicId, selectLanguageData } = props;
  return (
    <MyTopicsPageModalsWrapper
      showAddModal={showAddModal}
      deleteTopicId={deleteTopicId}
      editTopicId={editTopicId}
      selectLanguageData={selectLanguageData}
    />
  );
}
