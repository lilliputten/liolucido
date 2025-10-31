import { redirect } from 'next/navigation';

import { availableTopicsRoute, welcomeRoute } from '@/config/routesConfig';
import { constructMetadata } from '@/lib/constructMetadata';
import { getCurrentUser } from '@/lib/session';
import { getT } from '@/i18n';
import { defaultLocale, TAwaitedLocaleProps } from '@/i18n/types';

export async function generateMetadata({ params }: TAwaitedLocaleProps) {
  const { locale } = await params;
  // const t_ = await getTranslations({ locale, namespace: 'RootPage' });
  const t = await getT({ locale, namespace: 'RootPage' });
  return constructMetadata({
    title: t('title'),
    locale,
  });
}

// This page only renders when the app is built statically (output: 'export')
export default async function DefaultRootPage() {
  const prefix = '/' + defaultLocale;
  const user = await getCurrentUser();
  const route = user ? availableTopicsRoute : welcomeRoute;
  redirect(prefix + route);
}
