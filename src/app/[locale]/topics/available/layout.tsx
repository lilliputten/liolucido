import { setRequestLocale } from 'next-intl/server';

import {
  TopicsContextProvider,
  TopicsManageScopeIds,
  topicsNamespaces,
  topicsRoutes,
  TTopicsManageScopeId,
} from '@/contexts/TopicsContext';
import { getThisUserTopics } from '@/features/topics/actions';
import { TTopic } from '@/features/topics/types';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TAwaitedProps = TAwaitedLocaleProps;

type TLayoutProps = TAwaitedProps & {
  children: React.ReactNode;
};

const scope: TTopicsManageScopeId = TopicsManageScopeIds.AVAILABLE_TOPICS;

export default async function AvailableTopicsLayout(props: TLayoutProps) {
  const { children, params } = props;
  const { locale } = await params;

  const namespace = topicsNamespaces[scope];
  const routePath = topicsRoutes[scope];

  // Enable static rendering
  setRequestLocale(locale);

  // TODO: getAvailableTopics()
  const topicsPromise = getThisUserTopics();
  const topics: TTopic[] = (await topicsPromise) || [];

  return (
    <TopicsContextProvider
      topics={topics}
      namespace={namespace}
      manageScope={scope}
      routePath={routePath}
    >
      {children}
    </TopicsContextProvider>
  );
}
