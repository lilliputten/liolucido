import React from 'react';

import { TPropsWithChildren } from '@/shared/types/generic';
import { getCurrentUser } from '@/lib/session';

import { GenericLayoutContent } from './GenericLayoutContent';

export async function GenericLayout(props: TPropsWithChildren) {
  const { children } = props;
  const user = await getCurrentUser();
  return (
    <GenericLayoutContent {...props} user={user}>
      {children}
    </GenericLayoutContent>
  );
}
