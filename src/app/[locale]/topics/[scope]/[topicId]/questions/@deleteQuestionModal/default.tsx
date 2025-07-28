import { TTopicsManageScopeId } from '@/contexts/TopicsContext';

interface DeleteQuestionModalPageProps {
  searchParams: Promise<{ questionId?: string }>;
  params: Promise<{ scope: TTopicsManageScopeId }>;
}

export default async function DeleteQuestionModalDefaultPage(_props: DeleteQuestionModalPageProps) {
  return null;
}
