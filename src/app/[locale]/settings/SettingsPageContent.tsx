'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { TPropsWithClassName } from '@/shared/types/generic';
import { getRandomHashString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SettingsForm } from '@/components/pages/SettingsPage/SettingsForm';
import { isDev } from '@/constants';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { TDefinedUserId } from '@/features/users/types/TUser';

import { SettingsLoading } from './SettingsLoading';

const saveScrollHash = getRandomHashString();

type TSettingsPageContentProps = TPropsWithClassName & {
  userId?: TDefinedUserId;
};
type TChildProps = {
  toolbarPortalRef: React.RefObject<HTMLDivElement>;
};

function Toolbar({ toolbarPortalRef }: TChildProps) {
  return (
    <div
      ref={toolbarPortalRef}
      className={cn(
        isDev && '__SettingsPageContent_Toolbar', // DEBUG
        'flex flex-wrap gap-2',
      )}
    >
      {/* TODO: Place other shared buttons here
      <Button disabled variant="ghost" size="sm" className="flex gap-2">
        <Link href="#" className="flex items-center gap-2">
          <Icons.check className="hidden size-4 sm:block" />
          <span>Save</span>
        </Link>
      </Button>
      */}
    </div>
  );
}

function Header(props: TChildProps) {
  return (
    <CardHeader
      className={cn(
        isDev && '__SettingsPageContent_Header', // DEBUG
        'flex flex-row flex-wrap items-start',
      )}
    >
      {/* // UNUSED: Title section */}
      <Toolbar {...props} />
    </CardHeader>
  );
}

export function SettingsPageContent(props: TSettingsPageContentProps) {
  const { className, userId } = props;
  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const { settings, ready } = useSettingsContext();
  const t = useTranslations('SettingsPage');
  if (!ready) {
    return <SettingsLoading />;
  }
  return (
    <>
      <DashboardHeader
        heading={t('title')}
        text={t('description')}
        className={cn(
          isDev && '__SettingsPageContent_CardContent', // DEBUG
          'mx-4',
        )}
      />
      <Card
        className={cn(
          isDev && '__SettingsPageContent_Card', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden',
          'mx-4',
          className,
        )}
      >
        <Header toolbarPortalRef={toolbarPortalRef} />
        <CardContent
          className={cn(
            isDev && '__SettingsPageContent_CardContent', // DEBUG
            'relative flex flex-1 flex-col overflow-hidden px-0',
          )}
        >
          <ScrollArea saveScrollKey="SettingsPageContent" saveScrollHash={saveScrollHash}>
            <SettingsForm settings={settings} userId={userId} toolbarPortalRef={toolbarPortalRef} />
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}
