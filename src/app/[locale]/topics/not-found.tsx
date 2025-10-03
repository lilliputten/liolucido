'use client';

import { cn } from '@/lib/utils';
import { PageWrapper } from '@/components/layout/PageWrapper';
import NotFoundScreen from '@/components/pages/shared/NotFoundScreen';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';

// TODO: Force 404 status code for the response

export default function NotFound() {
  return (
    <PageWrapper
      className={cn(
        isDev && '__NotFoundPage', // DEBUG
        'w-full p-4',
      )}
      innerClassName="gap-6 justify-center items-center"
      scrollable
      limitWidth
    >
      <NotFoundScreen
        className={cn(
          isDev && '__NotFoundPage_Screen', // DEBUG
          'w-full',
        )}
        icon={Icons.Topics}
        title="Wrong topics page requested"
      />
    </PageWrapper>
  );
}
