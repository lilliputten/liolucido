import { ContentSkeleton } from './ContentSkeleton';
import { MyTopicsPageWrapper } from './MyTopicsPageWrapper';
import { PageHeader } from './PageHeader';

export function MyTopicsLoading() {
  return (
    <MyTopicsPageWrapper inSkeleton>
      <PageHeader />
      <ContentSkeleton />
    </MyTopicsPageWrapper>
  );
}
