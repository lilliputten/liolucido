import React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';

export type IconProps = LucideProps;
export type IconType = (p: IconProps) => React.JSX.Element;
export type { LucideIcon } from 'lucide-react';

export type TGenericIcon = IconType | LucideIcon;
