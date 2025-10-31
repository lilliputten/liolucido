'use client';

import { TPropsWithClassName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AppIntroBlock } from '@/components/content/AppIntroBlock';
import { isDev } from '@/constants';
import { useT } from '@/i18n';

export function SmallWelcomeText(props: TPropsWithClassName) {
  const { className } = props;
  const t = useT();

  return (
    <div
      className={cn(
        isDev && '__IntroText', // DEBUG
        className,
        'flex max-w-md flex-col gap-4',
        'text-content',
      )}
    >
      <h1 className="text-center">{t('WelcomePageTitle')}</h1>
      <AppIntroBlock />
    </div>
  );
}
