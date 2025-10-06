import React from 'react';

import { getCurrentUser } from '@/lib/session';
import { TPropsWithChildren } from '@/lib/types';

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
