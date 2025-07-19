'use client';

import { usePathname, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';

// TODO: Force 404 status code for the response

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <PageWrapper
      className={cn(
        isDev && '__NotFoundPage', // DEBUG
      )}
      innerClassName="gap-6 justify-center items-center"
      scrollable
      limitWidth
    >
      <h1 className="text-2xl font-normal">
        Error: Page <u>{pathname}</u> not found!
      </h1>
      <div className="flex flex-row gap-4 text-base text-muted-foreground">
        <Button onClick={() => router.back()}>
          <Icons.arrowLeft className="mr-2 size-4" />
          Go back
        </Button>
        <Button onClick={() => router.push('/')}>
          <Icons.home className="mr-2 size-4" />
          Go home
        </Button>
      </div>
    </PageWrapper>
  );
}
