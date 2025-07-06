import React from 'react';

import { envServer } from '@/env/envServer';
import { TPropsWithChildren } from '@/shared/types/generic';
import { getCurrentUser } from '@/lib/session';

import { GenericLayoutContent } from './GenericLayoutContent';

export async function GenericLayout(props: TPropsWithChildren) {
  const { children } = props;
  const user = await getCurrentUser();
  const isUserRequired = envServer.USER_REQUIRED;
  return (
    <GenericLayoutContent {...props} user={user} isUserRequired={isUserRequired}>
      {children}
    </GenericLayoutContent>
  );
}
