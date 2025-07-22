'use client';

import React from 'react';

import { TPropsWithClassName } from '@/shared/types/generic';
import { getRandomHashString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { TDefinedUserId } from '@/features/users/types/TUser';

import { SettingsForm } from './SettingsForm';

const saveScrollHash = getRandomHashString();

type TSettingsCardProps = TPropsWithClassName & {
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
        isDev && '__SettingsCard_Toolbar', // DEBUG
        'flex flex-wrap gap-2',
      )}
    >
      {/* TODO: Place shared buttons here */}
    </div>
  );
}

function Header(props: TChildProps) {
  return (
    <CardHeader
      className={cn(
        isDev && '__SettingsCard_Header', // DEBUG
        'flex flex-row flex-wrap items-start',
      )}
    >
      {/* // UNUSED: Title section
      <Title />
      */}
      <Toolbar {...props} />
    </CardHeader>
  );
}

export function SettingsCard(props: TSettingsCardProps) {
  const { className, userId } = props;
  const toolbarPortalRef = React.useRef<HTMLDivElement>(null);
  const { settings } = useSettingsContext();
  /* // Detect user mode
   * const user = useSessionUser();
   * const isAdminMode = user?.role === 'ADMIN';
   */
  return (
    <Card
      className={cn(
        isDev && '__SettingsCard', // DEBUG
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <Header toolbarPortalRef={toolbarPortalRef} />
      <CardContent
        className={cn(
          isDev && '__SettingsCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <ScrollArea saveScrollKey="SettingsCard" saveScrollHash={saveScrollHash}>
          <SettingsForm settings={settings} userId={userId} toolbarPortalRef={toolbarPortalRef} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
