'use client';

import { usePathname, useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { isDev } from '@/constants';

// TODO: Force 404 status code for the response

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div
      className={cn(
        isDev && '__NotFoundPage', // DEBUG
        'layout-follow',
        'gap-6',
        'flex-1',
        'flex flex-col',
        'justify-center',
        'items-center',
      )}
    >
      <h1 className="text-2xl font-normal">
        Error: Page <u>{pathname}</u> not found!
      </h1>
      <div className="flex flex-row gap-2 text-base text-muted-foreground">
        <Button onClick={() => router.back()}>Go back</Button>
        <Button onClick={() => router.push('/')}>Go home</Button>
      </div>
    </div>
  );
}
