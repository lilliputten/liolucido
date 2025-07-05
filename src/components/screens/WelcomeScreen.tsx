'use client';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { SignInBlock } from '@/components/blocks/SignInBlock';
import { WelcomeVisualBlock } from '@/components/blocks/WelcomeVisualBlock';
import { UseScrollableLayout } from '@/components/shared/ScrollableLayout';
import { isDev } from '@/constants';

export function WelcomeScreen(props: TPropsWithClassName) {
  const { className } = props;
  return (
    <div
      className={cn(
        isDev && '__WelcomeScreen', // DEBUG
        className,
        'flex flex-1 flex-col md:flex-row-reverse',
        'gap-8',
        'items-stretch',
        'justify-stretch',
        'md:layout-follow',
        'overflow-auto',
        'md:overflow-hidden',
      )}
    >
      <UseScrollableLayout type="clippable" />
      <div
        className={cn(
          isDev && '__WelcomeScreen:Info', // DEBUG
          'flex-1',
          'flex flex-col',
          'bg-primary-500/20',
          'md:overflow-auto',
        )}
      >
        <WelcomeVisualBlock />
      </div>
      <div
        className={cn(
          isDev && '__WelcomeScreen:SignIn', // DEBUG
          'flex-1',
          'flex flex-col',
          'md:overflow-auto',
        )}
      >
        <SignInBlock />
      </div>
    </div>
  );
}
