'use client';

import { usePathname, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/layout/PageWrapper';
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
      <div className="flex flex-row gap-2 text-base text-muted-foreground">
        <Button onClick={() => router.back()}>Go back</Button>
        <Button onClick={() => router.push('/')}>Go home</Button>
      </div>
    </PageWrapper>
  );
}
