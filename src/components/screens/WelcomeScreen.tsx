'use client';

import React from 'react';

import { TPropsWithClassName } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { SignInBlock } from '@/components/blocks/SignInBlock';
import { WelcomeVisualBlock } from '@/components/blocks/WelcomeVisualBlock';
import { UseScrollableLayout } from '@/components/shared/ScrollableLayout';
import { isDev } from '@/constants';

export function WelcomeScreen(props: TPropsWithClassName & { isLoggedUser: boolean }) {
  const { className, isLoggedUser } = props;
  return (
    <div
      className={cn(
        isDev && '__WelcomeScreen', // DEBUG
        className,
        'lg:layout-follow flex flex-1 flex-col items-stretch justify-stretch gap-4 overflow-auto lg:flex-row lg:overflow-hidden',
      )}
    >
      <UseScrollableLayout type="clippable" />
      <div
        className={cn(
          isDev && '__WelcomeScreen_Info', // DEBUG
          'relative flex flex-1 flex-col bg-theme-500/10 lg:overflow-auto',
        )}
      >
        <div
          className={cn(
            isDev && '__WelcomeScreen_Gradient', // DEBUG
            'absolute bottom-0 left-0 right-0 top-0 lg:overflow-hidden',
            'decorative-gradient',
          )}
        />
        <WelcomeVisualBlock className="z-10" />
      </div>
      {!isLoggedUser && (
        <div
          className={cn(
            isDev && '__WelcomeScreen_SignIn', // DEBUG
            'flex flex-1 flex-col lg:overflow-auto',
          )}
        >
          <SignInBlock />
        </div>
      )}
    </div>
  );
}
