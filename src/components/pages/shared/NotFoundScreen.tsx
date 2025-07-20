'use client';

import { usePathname, useRouter } from 'next/navigation';

import { TReactNode } from '@/shared/types/generic';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/icons';

// TODO: Force 404 status code for the response

interface TNotFoundScreenProps {
  title?: TReactNode;
}

export default function NotFoundScreen(props: TNotFoundScreenProps) {
  const { title } = props;
  const router = useRouter();
  const pathname = usePathname();
  const titleContent = title || (
    <>
      Page <u>{pathname}</u> not found!
    </>
  );
  return (
    <>
      <h1 className="text-2xl font-normal">{titleContent}</h1>
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
    </>
  );
}
