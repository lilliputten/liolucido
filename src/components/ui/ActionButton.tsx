'use client';

import React from 'react';

import { TReactNode } from '@/shared/types/generic';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/Button';
import * as Icons from '@/components/shared/Icons';
import { IconProps, TGenericIcon } from '@/components/shared/IconTypes';

export interface TActionItem extends Omit<ButtonProps, 'content'> {
  id: string;
  content?: TReactNode;
  pending?: boolean;
  onClick?: () => void;
  icon?: TGenericIcon;
  iconProps?: IconProps;
}

export function ActionButton(props: TActionItem) {
  const {
    id,
    pending,
    disabled,
    variant = 'ghostTheme',
    icon,
    content,
    iconProps = {},
    onClick,
    className: buttonClassName,
    ...restButtonProps
  } = props;
  const { className: iconClassName, ...restIconProps } = iconProps;
  const Icon = pending ? Icons.Spinner : icon;
  const isDisabled = pending || disabled;
  const isIcon = restButtonProps.size === 'icon';
  return (
    <Button
      key={id}
      className={cn('flex gap-2', buttonClassName)}
      onClick={onClick}
      disabled={isDisabled}
      variant={isDisabled ? 'ghostTheme' : variant}
      {...restButtonProps}
    >
      {Icon && (
        <Icon
          className={cn(
            isIcon ? 'size-5' : 'size-4 opacity-50',
            pending && 'animate-spin',
            iconClassName,
          )}
          {...restIconProps}
        />
      )}
      {content && !isIcon && <span className="flex flex-1 truncate">{content}</span>}
    </Button>
  );
}
