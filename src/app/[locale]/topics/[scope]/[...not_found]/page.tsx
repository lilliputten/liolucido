import { cn } from '@/lib/utils';
import { PageWrapper } from '@/components/layout/PageWrapper';
import NotFoundScreen from '@/components/pages/shared/NotFoundScreen';
import { isDev } from '@/constants';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return { status: 404 };
}

export default function NotFound() {
  return (
    <PageWrapper
      className={cn(
        isDev && '__TopicNotFoundPage', // DEBUG
      )}
      innerClassName="gap-6 justify-center items-center"
      scrollable
      limitWidth
    >
      <NotFoundScreen
        className={cn(
          isDev && '__TopicNotFoundPage_Screen', // DEBUG
          'w-full',
        )}
        iconName="Topics"
        title="Wrong topic sub page requested"
      />
    </PageWrapper>
  );
}
