'use client';

import { TPropsWithClassName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AppIntroBlock } from '@/components/content/AppIntroBlock';
import { isDev } from '@/constants';

export function SmallWelcomeText(props: TPropsWithClassName) {
  const { className } = props;
  return (
    <div
      className={cn(
        isDev && '__IntroText', // DEBUG
        className,
        'flex max-w-md flex-col gap-4',
        'text-content',
        // 'text-center', // Only for small texts
      )}
    >
      <h1 className="text-center">Welcome!</h1>
      <AppIntroBlock />
    </div>
  );
}
