import { cn } from '@/lib/utils';
import { PageWrapper } from '@/components/layout/PageWrapper';
import NotFoundScreen from '@/components/pages/shared/NotFoundScreen';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return { status: 404 };
}

export default function NotFound() {
  return (
    <PageWrapper
      className={cn(
        isDev && '__AnswerNotFoundPage', // DEBUG
      )}
      innerClassName="gap-6 justify-center items-center"
      scrollable
      limitWidth
    >
      <NotFoundScreen
        className={cn(
          isDev && '__AnswerNotFoundPage_Screen', // DEBUG
          'w-full',
        )}
        icon={Icons.Answers}
        title="Wrong answer component requested"
      />
    </PageWrapper>
  );
}
