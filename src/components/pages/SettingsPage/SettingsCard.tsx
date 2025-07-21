import React from 'react';
import Link from 'next/link';

import { TPropsWithClassName } from '@/shared/types/generic';
import { getRandomHashString } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { DemoList } from '@/components/debug/DemoList';
import { Icons } from '@/components/shared/icons';
import { isDev } from '@/constants';

// import { useSettingsContext } from '@/contexts/SettingsContext/SettingsContext';
// import { TSettings } from '@/features/settings/types';

const saveScrollHash = getRandomHashString();

type TSettingsCardProps = TPropsWithClassName;
type TChildProps = Omit<TSettingsCardProps, 'className'>;

/* // UNUSED: Title
 * function Title() {
 *   return (
 *     <div
 *       className={cn(
 *         isDev && '__SettingsCard_Title', // DEBUG
 *         'grid flex-1 gap-2',
 *       )}
 *     >
 *       <CardTitle>Current settings</CardTitle>
 *       <CardDescription className="sr-only text-balance">My own settings.</CardDescription>
 *     </div>
 *   );
 * }
 */

function Toolbar(_props: TChildProps) {
  return (
    <div
      className={cn(
        isDev && '__SettingsCard_Toolbar', // DEBUG
        'flex flex-wrap gap-2',
      )}
    >
      <Button disabled variant="ghost" size="sm" className="flex gap-2 px-4">
        <Link href="#" className="flex items-center gap-2">
          <Icons.check className="hidden size-4 sm:block" />
          <span>Save</span>
        </Link>
      </Button>
      <Button disabled variant="ghost" size="sm" className="flex gap-2 px-4">
        <Link href="#" className="flex items-center gap-2">
          <Icons.refresh className="hidden size-4 sm:block" />
          <span>Refresh</span>
        </Link>
      </Button>
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
      {/* <Title /> */}
      <Toolbar {...props} />
    </CardHeader>
  );
}

export function SettingsCard(props: TSettingsCardProps) {
  const { className } = props;
  // const { settings } = useSettingsContext();
  /* // Detect user mode
   * const user = useSessionUser();
   * const isAdminMode = user?.role === 'ADMIN';
   */
  return (
    <Card
      className={cn(
        isDev && '__SettingsCard', // DEBUG
        'xl:col-span-2',
        'relative flex flex-1 flex-col overflow-hidden',
        className,
      )}
    >
      <Header {...props} />
      <CardContent
        className={cn(
          isDev && '__SettingsCard_Content', // DEBUG
          'relative flex flex-1 flex-col overflow-hidden px-0',
        )}
      >
        <ScrollArea
          saveScrollKey="SettingsCard"
          saveScrollHash={saveScrollHash}
          viewportClassName="px-6"
        >
          <DemoList count={70} />
          CONTENT
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
