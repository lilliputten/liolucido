'use client';

import React, { useContext } from 'react';
import { LoginButton, TelegramAuthData } from '@telegram-auth/react';
import { signIn, SignInAuthorizationParams, SignInOptions } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';

import { envClient } from '@/env/envClient';
import { myTopicsRoute } from '@/config/routesConfig';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ModalContext } from '@/components/modals/providers';
import { Icons, IconType } from '@/components/shared/icons';
import { Logo } from '@/components/shared/Logo';
import { isDev } from '@/constants';
import { TLocale } from '@/i18n/types';

type TSignInParameters = Parameters<typeof signIn>;
export type TSignInProvider = TSignInParameters[0];

interface OAuthSignInButtonProps {
  currentProvider?: TSignInProvider;
  onSignInStart?: (provider: TSignInProvider) => void;
  onSignInDone?: (provider: TSignInProvider) => void;
  provider: TSignInProvider;
  ProviderIcon: IconType; // React.FC;
  text: string;
  inBody?: boolean;
}

function OAuthSignInButton(props: OAuthSignInButtonProps) {
  const locale = useLocale() as TLocale;
  const { showSignInModal } = useContext(ModalContext);
  const {
    // prettier-ignore
    currentProvider,
    onSignInStart,
    onSignInDone,
    provider,
    ProviderIcon,
    text,
    inBody,
  } = props;
  const isClicked = !!currentProvider;
  const isThisClicked = currentProvider == provider;
  const onSignIn = React.useCallback(
    (data?: TelegramAuthData) => {
      /* Sample data (from `telegram-auth-nextjs-try`):
       * auth_date: 1747950723
       * first_name: "Ig"
       * hash: "a47923396af8b254c4495f22e7b4269973e9ae684d7fbe841934a6a8fcf70f93"
       * id: 490398083
       * photo_url: "https://t.me/i/userpic/320/3meBKT_rsGqbt3HOAqNHdAIWEQYHGeW3m86yeYhZiUo.jpg"
       * username: "lilliputten"
       */
      // TODO: Do smth another if provider === 'telegram-auth'
      const options: SignInOptions = {
        /*
         * callbackUrl?: string (Deprecated)
         * redirectTo?: string
         * redirect?: Redirect (boolean)
         */
        redirectTo: myTopicsRoute,
      };
      const params = data ? (data as unknown as SignInAuthorizationParams) : undefined;
      /* console.log('[SignInForm:onSignIn]', provider, {
       *   data,
       *   provider,
       *   dataRoute,
       *   params,
       *   options,
       *   onSignInStart,
       *   onSignInDone,
       * });
       */
      if (onSignInStart) {
        onSignInStart(provider);
      }
      // @see https://next-auth.js.org/getting-started/client#specifying-a-callbackurl
      signIn(provider, options, params).then(() => {
        if (onSignInDone) {
          onSignInDone(provider);
        }
      });
    },
    [onSignInStart, onSignInDone, provider],
  );

  const icon = isThisClicked ? (
    <Icons.spinner className="mr-2 size-4 animate-spin" />
  ) : (
    <ProviderIcon className="mr-2 size-4" />
  );

  if (provider === 'telegram-auth') {
    // TODO: Check if SignIn modal not opened
    if (inBody && showSignInModal) {
      return null;
    }
    /* // Possible LoginButton params:
     * authCallbackUrl?: string;
     * botUsername: string;
     * buttonSize?: 'large' | 'medium' | 'small';
     * cornerRadius?: number;
     * lang?: string;
     * onAuthCallback?: (data: TelegramAuthData) => void;
     * requestAccess?: 'write' | null;
     * showAvatar?: boolean;
     * widgetVersion?: number | string;
     */
    return (
      <div
        className={cn(
          // prettier-ignore
          isDev && '__sign-in-telegram-button',
          isDev && '__provider-' + provider,
          // styles.TelegramLogin,
          isClicked && 'opacity-50',
          isClicked && 'cursor-not-allowed',
          isClicked && 'pointer-events-none',
          'flex flex-col',
          'items-center',
          'justify-between',
          'transition-opacity',
          'hover:opacity-90',
        )}
        // variant="primary"
        // rounded="full"
        // disabled={isClicked}
      >
        <>
          {/*
          {icon} {text}
          */}
          <LoginButton
            // @see
            botUsername={envClient.NEXT_PUBLIC_BOT_USERNAME}
            onAuthCallback={onSignIn}
            // showAvatar={false}
            buttonSize="large"
            lang={locale}
          />
        </>
      </div>
    );
  }

  return (
    <Button
      className={cn(
        // prettier-ignore
        isDev && '__SignInModal-button',
        isDev && '__provider-' + provider,
      )}
      variant="primary"
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
      <a href={siteConfig.url}>
        <Logo className="size-32" dark={dark} />
      </a>
      <h3
        className={cn(
          // prettier-ignore
          'font-urban',
          'text-2xl',
          'font-bold',
          'text-app-orange',
        )}
      >
        {t('sign-in')}
      </h3>
      <p
        className={cn(
          // prettier-ignore
          'text-center',
          'text-sm',
        )}
      >
        {t('intro')}
      </p>
    </>
  );
}

interface TSignInFormProps {
  onSignInStart?: (provider: TSignInProvider) => void;
  onSignInDone?: (provider: TSignInProvider) => void;
  inBody?: boolean;
}

export function SignInForm(props: TSignInFormProps) {
  const { onSignInStart, onSignInDone, inBody } = props;
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
        ProviderIcon={Icons.github}
        text={t('sign-in-with-github')}
        inBody={inBody}
      />
      <OAuthSignInButton
        currentProvider={currentProvider}
        onSignInStart={handleSignInStart}
        onSignInDone={onSignInDone}
        provider="yandex"
        ProviderIcon={Icons.yandex}
        text={t('sign-in-with-yandex')}
        inBody={inBody}
      />
      <OAuthSignInButton
        currentProvider={currentProvider}
        onSignInStart={handleSignInStart}
        onSignInDone={onSignInDone}
        provider="google"
        ProviderIcon={Icons.google}
        text={t('sign-in-with-google')}
        inBody={inBody}
      />
      <OAuthSignInButton
        currentProvider={currentProvider}
        onSignInStart={handleSignInStart}
        onSignInDone={onSignInDone}
        provider="telegram-auth"
        ProviderIcon={Icons.telegram}
        text={t('sign-in-with-telegram')}
        inBody={inBody}
      />
      {/* TODO: Email login section (resend) */}
    </>
  );
}
