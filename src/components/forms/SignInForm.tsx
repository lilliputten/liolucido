'use client';

import React from 'react';
import Image from 'next/image';
import { signIn, SignInOptions } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { myTopicsRoute } from '@/config/routesConfig';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import * as Icons from '@/components/shared/Icons';
import logoWhiteSvg from '@/assets/logo/logo-image-w.svg';
import logoSvg from '@/assets/logo/logo-image.svg';
import { isDev } from '@/constants';

import { TGenericIcon } from '../shared/IconTypes';

type TSignInParameters = Parameters<typeof signIn>;
export type TSignInProvider = TSignInParameters[0];

interface OAuthSignInButtonProps {
  currentProvider?: TSignInProvider;
  onSignInStart?: (provider: TSignInProvider) => void;
  onSignInDone?: (provider: TSignInProvider) => void;
  provider: TSignInProvider;
  ProviderIcon: TGenericIcon; // React.FC;
  text: string;
  /** Rendered inside a body or in the app header */
  inBody?: boolean;
}

function OAuthSignInButton(props: OAuthSignInButtonProps) {
  const {
    // prettier-ignore
    currentProvider,
    onSignInStart,
    onSignInDone,
    provider,
    ProviderIcon,
    text,
    // inBody,
  } = props;
  const isClicked = !!currentProvider;
  const isThisClicked = currentProvider == provider;
  const onSignIn = React.useCallback(() => {
    const options: SignInOptions = { redirectTo: myTopicsRoute };
    if (onSignInStart) {
      onSignInStart(provider);
    }
    // @see https://next-auth.js.org/getting-started/client#specifying-a-callbackurl
    signIn(provider, options).then(() => {
      if (onSignInDone) {
        onSignInDone(provider);
      }
    });
  }, [onSignInStart, onSignInDone, provider]);

  const icon = isThisClicked ? (
    <Icons.Spinner className="mr-2 size-4 animate-spin" />
  ) : (
    <ProviderIcon className="mr-2 size-4" />
  );

  return (
    <Button
      className={cn(
        isDev && '__SignInModal-button', // DEBUG
        isDev && '__provider-' + provider,
      )}
      variant="theme"
      rounded="full"
      disabled={isClicked}
      onClick={() => onSignIn()}
    >
      {icon} {text}
    </Button>
  );
}

interface TSignInFormHeaderProps {
  dark?: boolean;
}

export function SignInFormHeader(props: TSignInFormHeaderProps) {
  const { dark } = props;
  const t = useTranslations('SignInForm');
  return (
    <>
      <a href={siteConfig.url} className="transition hover:opacity-80">
        {/*
        <Logo className="size-32" dark={dark} />
         */}
        <Image
          src={dark ? logoWhiteSvg : logoSvg}
          className="h-24 w-auto"
          alt={siteConfig.name}
          priority={false}
        />
      </a>
      <h3 className="font-urban text-app-orange text-2xl font-bold">{t('sign-in')}</h3>
      <p className="text-center text-sm">{t('intro')}</p>
    </>
  );
}

interface TSignInFormProps {
  onSignInStart?: (provider: TSignInProvider) => void;
  onSignInDone?: (provider: TSignInProvider) => void;
  /** Rendered inside a body or in the app header */
  inBody?: boolean;
}

export function SignInForm(props: TSignInFormProps) {
  const { onSignInStart, onSignInDone } = props;
  const [currentProvider, setCurrentProvider] = React.useState<TSignInProvider>(undefined);
  const t = useTranslations('SignInForm');

  const handleSignInStart = React.useCallback(
    (provider: TSignInProvider) => {
      setCurrentProvider(provider);
      if (onSignInStart) {
        onSignInStart(provider);
      }
    },
    [onSignInStart],
  );

  return (
    <>
      <OAuthSignInButton
        currentProvider={currentProvider}
        onSignInStart={handleSignInStart}
        onSignInDone={onSignInDone}
        provider="github"
        ProviderIcon={Icons.Github}
        text={t('sign-in-with-github')}
        // inBody={inBody}
      />
      <OAuthSignInButton
        currentProvider={currentProvider}
        onSignInStart={handleSignInStart}
        onSignInDone={onSignInDone}
        provider="yandex"
        ProviderIcon={Icons.Yandex}
        text={t('sign-in-with-yandex')}
        // inBody={inBody}
      />
      <OAuthSignInButton
        currentProvider={currentProvider}
        onSignInStart={handleSignInStart}
        onSignInDone={onSignInDone}
        provider="google"
        ProviderIcon={Icons.Google}
        text={t('sign-in-with-google')}
        // inBody={inBody}
      />
      {/* // NOTE: Temporarily don't use telegram login, as it's buggy (see `team-tree-app` project for an example of `telegram-auth` usage)
      <OAuthSignInButton
        currentProvider={currentProvider}
        onSignInStart={handleSignInStart}
        onSignInDone={onSignInDone}
        provider="telegram-auth"
        ProviderIcon={Icons.Telegram}
        text={t('sign-in-with-telegram')}
        // inBody={inBody}
      />
      */}
      {/* TODO: Email login section (resend) */}
    </>
  );
}
