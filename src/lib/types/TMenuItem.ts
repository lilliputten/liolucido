import React from 'react';

export interface TMenuItem {
  id: string;
  title: string;
  icon?: React.ReactElement;
  url?: string;
}
