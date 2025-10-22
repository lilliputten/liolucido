import { redirect } from 'next/navigation';

import { welcomeRoute } from '@/config/routesConfig';
import { constructMetadata } from '@/lib/constructMetadata';
import { isAdminUser } from '@/lib/session';
import { cn } from '@/lib/utils';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { isDev } from '@/config';

import { BotControlPage } from './BotControlPage';

export async function generateMetadata(/* { params }: TAwaitedLocaleProps */) {
  return constructMetadata({
    title: 'Start Bot',
  });
}

export default async function BotControlPageWrapper() {
  const isAdmin = await isAdminUser();

  if (!isAdmin) {
    return redirect(welcomeRoute);
  }

  return (
    <PageWrapper
      id="BotControlPageWrapper"
      className={cn(
        isDev && '__BotControlPageWrapper', // DEBUG
      )}
      innerClassName={cn(
        isDev && '__BotControlPageWrapper_Inner', // DEBUG
        'w-full rounded-lg gap-6 py-6',
      )}
      limitWidth
    >
      <BotControlPage />
    </PageWrapper>
  );
}
