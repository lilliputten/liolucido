import { redirect } from 'next/navigation';

import { welcomeRoute } from '@/config/routesConfig';
import { constructMetadata } from '@/lib/constructMetadata';
import { isAdminUser } from '@/lib/session';
import { cn } from '@/lib/utils';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { isDev } from '@/config';

import { TextQueryForm } from './TextQueryForm';

export async function generateMetadata(/* { params }: TAwaitedLocaleProps */) {
  return constructMetadata({
    title: 'Test AI Text Query',
  });
}

export default async function TestQueryPage() {
  const isAdmin = await isAdminUser();

  if (!isAdmin) {
    return redirect(welcomeRoute);
  }

  return (
    <PageWrapper
      id="TextQueryPage"
      className={cn(
        isDev && '__TextQueryPage', // DEBUG
      )}
      innerClassName={cn(
        isDev && '__TextQueryPage_Inner', // DEBUG
        'w-full rounded-lg gap-6 py-6',
      )}
      limitWidth
      // scrollable
    >
      <TextQueryForm />
    </PageWrapper>
  );
}
