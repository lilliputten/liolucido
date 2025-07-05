import { useLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { env } from '@/env';
import { TPropsWithChildren } from '@/shared/types/generic';
// import { TExtendedUser } from '@/features/users/types/TUser';
import { getCurrentUser } from '@/lib/session';
import { NavBar } from '@/components/layout/NavBar';
import { NavMobile } from '@/components/layout/NavMobile';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { TExtendedUser } from '@/features/users/types/TUser';
import { TLocale } from '@/i18n/types';

function GenericLayoutContent(props: TPropsWithChildren & { user?: TExtendedUser }) {
  const { children, user } = props;
  const isUser = !!user;
  const locale = useLocale() as TLocale;
  const isUserRequired = env.USER_REQUIRED;
  setRequestLocale(locale);
  return (
    <>
      <NavMobile isUser={isUser} isUserRequired={isUserRequired} />
      <NavBar isUser={isUser} isUserRequired={isUserRequired} />
      {children}
      <SiteFooter />
    </>
  );
}

export async function GenericLayout(props: TPropsWithChildren) {
  const { children } = props;
  const user = await getCurrentUser();
  return (
    <GenericLayoutContent {...props} user={user}>
      {children}
    </GenericLayoutContent>
  );
}
