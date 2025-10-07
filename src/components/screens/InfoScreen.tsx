'use client';

import React from 'react';

import { TPropsWithClassName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { InfoVisualBlock } from '@/components/blocks/InfoVisualBlock';
import { UseScrollableLayout } from '@/components/shared/ScrollableLayout';
import { isDev } from '@/constants';

export function InfoScreen(props: TPropsWithClassName & { isLoggedUser: boolean }) {
  const {
    className,
    // isLoggedUser,
  } = props;
  return (
    <div
      className={cn(
        isDev && '__InfoScreen', // DEBUG
        className,
        'lg:layout-follow flex flex-1 flex-col items-stretch justify-stretch gap-8 overflow-auto lg:flex-row lg:overflow-hidden',
      )}
    >
      <UseScrollableLayout type="clippable" />
      <div
        className={cn(
          isDev && '__InfoScreen_Info', // DEBUG
          'relative flex flex-1 flex-col items-stretch justify-center gap-4 bg-theme-500/10 p-4 lg:overflow-auto',
        )}
      >
        <div
          className={cn(
            isDev && '__InfoScreen_Gradient', // DEBUG
            'absolute bottom-0 left-0 right-0 top-0 lg:overflow-hidden',
            'decorative-gradient',
            // 'pointer-events-none',
          )}
        />
        {/* TODO: Show a bigger page with more content if user is logged (isLoggedUser)? */}
        <InfoVisualBlock className="z-10" />
        <div
          className={cn(
            isDev && '__IntroText', // DEBUG
            className,
            'gap-4',
            'text-content',
            'text-center', // Only for small texts
          )}
        >
          <h1>Information</h1>
          <p>Some extra text...</p>
          {/*generateArray(20).map((n) => (
            <p key={n}>Text {n + 1}</p>
          ))*/}
        </div>
      </div>
      {/*!isLoggedUser && (
        <div
          className={cn(
            isDev && '__InfoScreen_SignIn', // DEBUG
            'flex flex-1 flex-col lg:overflow-auto',
          )}
        >
          <SignInBlock />
        </div>
      )*/}
    </div>
  );
}
