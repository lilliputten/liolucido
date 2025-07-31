import { TTopicsManageScopeId } from '@/contexts/TopicsContext';

interface DeleteAnswerModalPageProps {
  searchParams: Promise<{ questionId?: string }>;
  params: Promise<{ scope: TTopicsManageScopeId }>;
}

export default async function DeleteAnswerModalDefaultPage(_props: DeleteAnswerModalPageProps) {
  return null;
}
