'use client';

import { cn } from '@/lib/utils';
import { PageWrapper } from '@/components/layout/PageWrapper';
import NotFoundScreen from '@/components/pages/shared/NotFoundScreen';
import { isDev } from '@/constants';

// TODO: Force 404 status code for the response

export default function NotFound() {
  return (
    <PageWrapper
      className={cn(
        isDev && '__NotFound', // DEBUG
      )}
      innerClassName="gap-6 justify-center items-center p-4"
      scrollable
      limitWidth
    >
      <NotFoundScreen
        title="Top"
        className={cn(
          isDev && '__NotFound_Screen', // DEBUG
          'w-full',
        )}
      />
    </PageWrapper>
  );
}
