'use client';

import { LoginButton, TelegramAuthData } from '@telegram-auth/react';
import {
  signIn,
  SignInAuthorizationParams,
  SignInOptions,
  signOut,
  useSession,
} from 'next-auth/react';

import { env } from '@/env';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/shared/icons';

export function NavTgSignInButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Icons.refresh className="size-6 animate-spin" />;
  }

  if (status === 'authenticated') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Avatar>
              <AvatarImage src={session.user?.image ?? '/default.webp'} />
              <AvatarFallback>{session.user?.name}</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Test 1</DropdownMenuItem>
          <DropdownMenuItem disabled>Test 2</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <Icons.logout className="mr-2 size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  function onSignIn(data: TelegramAuthData) {
    const options: SignInOptions = {
      callbackUrl: '/',
      // redirect: false,
    };
    const params = data as unknown as SignInAuthorizationParams;
    /* console.log('[NavTgSignInButton:onAuthCallback]', {
     *   data,
     * });
     */
    /* Sample data (from `telegram-auth-nextjs-try`)
     * auth_date: 1747950723
     * first_name: "Ig"
     * hash: "a47923396af8b254c4495f22e7b4269973e9ae684d7fbe841934a6a8fcf70f93"
     * id: 490398083
     * photo_url: "https://t.me/i/userpic/320/3meBKT_rsGqbt3HOAqNHdAIWEQYHGeW3m86yeYhZiUo.jpg"
     * username: "lilliputten"
     */
    signIn('telegram-auth', options, params);
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
    <LoginButton
      // @see
      botUsername={env.NEXT_PUBLIC_BOT_USERNAME}
      onAuthCallback={onSignIn}
      showAvatar={false}
      buttonSize="large"
      // lang
    />
  );
}
