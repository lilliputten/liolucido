import { ScrollArea } from '@radix-ui/react-scroll-area';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { commonXPaddingTwStyle } from '@/config/ui';
import { cn, constructMetadata } from '@/lib/utils';
import { DemoList } from '@/components/debug/DemoList';
import { MaxWidthWrapper } from '@/components/shared/MaxWidthWrapper';
import { UseScrollableLayout } from '@/components/shared/ScrollableLayout';
import { isDev } from '@/constants';
import { TAwaitedLocaleProps } from '@/i18n/types';

type TDataPageProps = TAwaitedLocaleProps;

export async function generateMetadata({ params }: TAwaitedLocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'DataPage' });
  return constructMetadata({
    title: t('title'),
    locale,
  });
}

export async function DataPage({ params }: TDataPageProps) {
  const { locale } = await params;

  /* // NOTE: Checking USER_REQUIRED or existed user session
   * const user = await getCurrentUser();
   * if (!user && env.USER_REQUIRED) {
   *   redirect(welcomeRoute);
   * }
   */

  // Enable static rendering
  setRequestLocale(locale);

  /* // UNUSED: Data loading
   * const fetchParams: TFetchRecordsByParentWithChildrenCountParams = {
   *   parentId: null,
   *   userId: user?.id || null,
   * };
   * const rootRecords: TRecordWithChildrenOrCount[] =
   *   await fetchRecordsByParentWithChildrenCount(fetchParams);
   */

  return (
    <div
      className={cn(
        isDev && '__DataPage', // DEBUG
        'flex flex-1 flex-col items-center',
        'layout-follow',
        commonXPaddingTwStyle,
      )}
    >
      <UseScrollableLayout type="clippable" />
      <MaxWidthWrapper
        className={cn(
          isDev && '__DataPage_HeaderContainer', // DEBUG
          'flex flex-col',
          'layout-follow',
          'm-auto',
        )}
      >
        <ScrollArea
          className={cn(
            isDev && '__DataPage_Scroll', // DEBUG
            'flex flex-col items-center',
            'layout-scrollable',
          )}
        >
          <DemoList count={50} className="w-full" />
        </ScrollArea>
      </MaxWidthWrapper>
    </div>
  );
}
