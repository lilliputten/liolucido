'use client';

import { useTranslations } from 'next-intl';

import { allTopicsRoute, infoRoute, myTopicsRoute, welcomeRoute } from '@/config/routesConfig';
import { TPropsWithClassName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { isDev } from '@/constants';
import { getUserStatusText } from '@/features/users/helpers/getUserStatusText';
import { useSessionUser } from '@/hooks';
import { Link } from '@/i18n/routing';

export function AppIntro(props: TPropsWithClassName) {
  const t = useTranslations('AppIntro');
  const { className } = props;
  const user = useSessionUser();
  const isAdmin = user?.role === 'ADMIN';
  return (
    <div
      className={cn(
        isDev && '__IntroText', // DEBUG
        'flex flex-col gap-2',
        'text-content',
        // 'text-center', // Only for small texts
        className,
      )}
    >
      {t.rich('content', {
        p: (chunks) => <p>{chunks}</p>,
        infolink: (chunks) => <Link href={infoRoute}>{chunks}</Link>,
      })}
      <p>You're currently {getUserStatusText(user)}.</p>
      <p>
        As a logged in user, you can{' '}
        <Link href={myTopicsRoute}>create and edit your own trainings</Link>, view detailed
        statistics and track your historical progress.
      </p>
      <p>As a regular user, you can view and work with public trainings created by other people.</p>
      <p>
        If you have a <Link href={welcomeRoute}>PRO subscription plan</Link>, then you can use AI
        genration of topics' questions and answers.
      </p>
      {isAdmin && (
        <p>
          As an admin, you can monitor and control{' '}
          <Link href={myTopicsRoute}>other users data</Link> and the users themselves.
        </p>
      )}
    </div>
  );
}
